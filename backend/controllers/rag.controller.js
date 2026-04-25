import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Fuse from "fuse.js";

let genAIInstance = null;
const getGenAI = () => {
  if (!genAIInstance) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    genAIInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAIInstance;
};


const retryGeminiCall = async (generateContentFn, maxRetries = 2, perAttemptTimeoutMs = 15000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const attemptPromise = generateContentFn();

      const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => {
          const toErr = new Error('Gemini request timed out');
          toErr.isTimeout = true;
          reject(toErr);
        }, perAttemptTimeoutMs);

        if (attemptPromise && typeof attemptPromise.then === 'function') {
          attemptPromise.then(() => clearTimeout(id)).catch(() => clearTimeout(id));
        }
      });

      return await Promise.race([attemptPromise, timeoutPromise]);
    } catch (error) {
      const msg = (error && (error.message || '')) || '';

      if (error && error.isTimeout) {
        if (attempt < maxRetries) {
          console.log(`Gemini request timed out (attempt ${attempt}/${maxRetries}), retrying...`);
          continue;
        }

        const rateError = new Error('Gemini timed out after retries');
        rateError.isRateLimit = true;
        rateError.retryAfterMs = perAttemptTimeoutMs;
        rateError.permanentQuota = true; // trigger offline fallback
        throw rateError;
      }

      const isRate = msg.includes('429') || msg.includes('Too Many Requests') || error?.code === 429;
      if (isRate) {
        let retryDelay = 21000;
        const retryMsMatch = msg.match(/retryDelay["\s]*:\s*["']?(\d+)s?/i);
        const retrySecMatch = msg.match(/Retry-After["\s]*[:=]?\s*["']?(\d+)/i);
        if (retryMsMatch) retryDelay = parseInt(retryMsMatch[1], 10) * 1000;
        else if (retrySecMatch) retryDelay = parseInt(retrySecMatch[1], 10) * 1000;

        if (attempt < maxRetries) {
          console.log(`Quota exceeded, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        const rateError = new Error('Rate limit exceeded');
        rateError.isRateLimit = true;
        rateError.retryAfterMs = retryDelay;
        rateError.permanentQuota = true; 
        throw rateError;
      }

      throw error;
    }
  }
};

const fuzzySearchProducts = async (query, limit = 10) => {
  try {
    if (!query || typeof query !== 'string') return [];
    const cleaned = String(query).replace(/[^a-z0-9\s]/gi, ' ').trim();
    if (!cleaned) return [];

    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const andConditions = words.map((w) => ({
        $or: [
          { name: { $regex: w, $options: 'i' } },
          { category: { $regex: w, $options: 'i' } },
          { description: { $regex: w, $options: 'i' } },
        ],
      }));

      const regexMatches = await Product.find({ $and: andConditions }).limit(Math.max(limit, 20)).lean();
      if (regexMatches && regexMatches.length > 0) return regexMatches;
    }

    const candidates = await Product.find({}).sort({ averageRating: -1 }).limit(300).lean();
    if (!candidates || candidates.length === 0) return [];

    const fuse = new Fuse(candidates, {
      keys: ['name', 'category', 'description'],
      threshold: 0.35,
      ignoreLocation: true,
    });

    const results = fuse.search(cleaned, { limit });
    return results.map(r => r.item);
  } catch (err) {
    console.error('fuzzySearchProducts error:', err);
    return [];
  }
};

const withDiscountedPrice = (productDoc) => {
  const product = productDoc.toObject ? productDoc.toObject() : productDoc;
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const discountedPrice = Number((price - (price * discount) / 100).toFixed(2));
  return { ...product, discountedPrice };
};

const mapProductsWithContext = (products = [], reviewMap = new Map()) => {
  return products.map((product) => {
    const reviews = reviewMap.get(String(product._id)) || [];
    const stock = Number(product.stock) || 0;

    let inventoryNote = "In stock";
    if (stock <= 0) inventoryNote = "Currently sold out";
    else if (stock <= 3) inventoryNote = `Only ${stock} left`;

    return {
      _id: product._id,
      name: product.name,
      category: product.category,
      coverImage: product.coverImage,
      status: product.status,
      price: product.price,
      discountedPrice: product.discountedPrice,
      averageRating: Number(product.averageRating || 0),
      reviewCount: Number(product.reviewCount || 0),
      stock,
      inventoryNote,
      reviews: reviews.slice(0, 3).map(r => ({ title: r.title, comment: r.comment, rating: r.rating })) // Include top reviews for LLM context
    };
  });
};

export const ragChat = async (req, res) => {
  try {
    const { message, productId, page = "general", limit = 4 } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const intentModel = getGenAI().getGenerativeModel({
      model: "gemini-1.5-flash",

      systemInstruction: "You are a helpful and conversational e-commerce AI shopping assistant. Your job is to determine what the user wants. If they are just greeting, asking about you, or making small talk, categorize as 'chitchat' and provide a friendly response. If they are asking for products, checking stock, asking for comparisons, or asking about reviews, extract a highly concise 'searchQuery' (1-2 words maximum) to search the database, and set the correct intent. Do not provide a reply if it is not chitchat.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            intent: { type: "string", enum: ["chitchat", "discovery", "comparison", "inventory", "sentiment"] },
            searchQuery: { type: "string", description: "Only the core product nouns to find items (e.g. 'laptop', 'running shoes'). Exclude verbs like 'buy' and stop words like 'a' or 'the'. Use empty string if chitchat." },
            reply: { type: "string", description: "The assistant's conversational reply if intent is chitchat. Use an empty string otherwise." }
          },
          required: ["intent", "searchQuery", "reply"]
        }
      }
    });

    const intentCompletion = await retryGeminiCall(() => intentModel.generateContent(message));
    let parsedIntent;
    try {
      const intentText = typeof intentCompletion?.response?.text === 'function' ? intentCompletion.response.text() : (intentCompletion?.response?.text || '');
      parsedIntent = intentText ? JSON.parse(intentText) : { intent: 'discovery', searchQuery: message, reply: '' };
    } catch (err) {
      console.error('Intent parse error:', err);
      parsedIntent = { intent: 'discovery', searchQuery: message, reply: '' };
    }

    if (parsedIntent.intent === "chitchat") {
      return res.status(200).json({
        intent: "chitchat",
        reply: parsedIntent.reply || "Hello! I am your AI personal shopping assistant. How can I help you today?",
        products: [],
        alternatives: [],
        comparisonSummary: null,
        meta: { page }
      });
    }

    const normalizedLimit = Math.max(1, Math.min(Number(limit) || 4, 8));
    const searchQuery = parsedIntent.searchQuery || "";
    
    let matchedProducts = [];
    if (productId) {
      const byId = await Product.findById(productId).lean();
      if (byId) matchedProducts = [byId];
    }

    if (!matchedProducts.length && searchQuery) {
        const words = searchQuery.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
        if (words.length > 0) {
            const conditions = words.map(w => {
                const rx = new RegExp(`\\b${w}`, "i"); 
                return {
                    $or: [
                        { name: rx },
                        { category: rx }
                    ]
                };
            });
            
            matchedProducts = await Product.find({ $and: conditions })
                .limit(10)
                .sort({ averageRating: -1 });
        }
    } else if (parsedIntent.intent === "discovery") {
        matchedProducts = await Product.find({}).limit(5).sort({ averageRating: -1 });
    }

    if ((!matchedProducts || matchedProducts.length === 0) && (searchQuery || message)) {
      const fuzzy = await fuzzySearchProducts(searchQuery || message, Math.max(normalizedLimit, 10));
      if (fuzzy && fuzzy.length > 0) matchedProducts = fuzzy;
    }

    const pickedProducts = matchedProducts.slice(0, Math.max(normalizedLimit, 2));

    const reviewDocs = await Review.find({ productId: { $in: pickedProducts.map((p) => p._id).filter(Boolean) } })
      .select("productId title comment rating");

    const reviewMap = reviewDocs.reduce((acc, review) => {
      const key = String(review.productId);
      const list = acc.get(key) || [];
      list.push(review);
      acc.set(key, list);
      return acc;
    }, new Map());

    const enrichedProducts = mapProductsWithContext(pickedProducts.map(withDiscountedPrice), reviewMap);

    const finalModel = getGenAI().getGenerativeModel({
      model: "gemini-1.5-flash",

      systemInstruction: "You are an expert e-commerce shopping assistant.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            reply: { type: "string", description: "The main conversational response to the user" },
            comparisonSummary: { type: "string", description: "A string summarizing the comparison if requested, otherwise use an empty string." },
            alternativeProductIds: { 
                type: "array", 
                items: { type: "string" }, 
                description: "Array of product _id strings to propose as alternatives if requested products are out of stock." 
            }
          },
          required: ["reply", "comparisonSummary", "alternativeProductIds"]
        }
      }
    });

    const prompt = `The user asked: "${message}". The initial intent was "${parsedIntent.intent}". I have fetched the following products from the database for context:\n\n${JSON.stringify(enrichedProducts)}\n\nYour task is to write a helpful response to the user. Base your answer strictly on the provided product context. If the user asked for a comparison, write a short 'comparisonSummary' string comparing the first two products. If they asked for items that are out of stock, suggest 'alternatives' (by returning an array of IDs for products in stock). Keep your 'reply' friendly, short, and directly addressing their request. Use ETB for currency where appropriate.`;

    const finalCompletion = await retryGeminiCall(() => finalModel.generateContent(prompt));
    let finalParsed = { reply: '', comparisonSummary: '', alternativeProductIds: [] };
    try {
      const finalText = typeof finalCompletion?.response?.text === 'function' ? finalCompletion.response.text() : (finalCompletion?.response?.text || '');
      finalParsed = finalText ? JSON.parse(finalText) : finalParsed;
    } catch (err) {
      console.error('Final parse error:', err);
    }

    const cleanedProducts = enrichedProducts.map(p => {
        const { reviews, ...rest } = p;
        return rest;
    });

    const altIds = Array.isArray(finalParsed.alternativeProductIds) ? finalParsed.alternativeProductIds.map(String) : [];
    let alternativesProducts = cleanedProducts.filter(p => altIds.includes(String(p._id)));

    const missingAltIds = altIds.filter(id => !alternativesProducts.some(p => String(p._id) === id));
    if (missingAltIds.length > 0) {
      const missingProds = await Product.find({ _id: { $in: missingAltIds } }).lean();
      if (missingProds && missingProds.length > 0) {
        const missingReviewDocs = await Review.find({ productId: { $in: missingProds.map(p => p._id) } }).select('productId title comment rating');
        const missingReviewMap = missingReviewDocs.reduce((acc, review) => {
          const key = String(review.productId);
          const list = acc.get(key) || [];
          list.push(review);
          acc.set(key, list);
          return acc;
        }, new Map());
        const missingEnriched = mapProductsWithContext(missingProds.map(withDiscountedPrice), missingReviewMap);
        const missingCleaned = missingEnriched.map(p => {
          const { reviews, ...rest } = p;
          return rest;
        });
        alternativesProducts = alternativesProducts.concat(missingCleaned);
      }
    }

    let outOfStockIds = cleanedProducts.filter(p => p.stock <= 0).map(p => String(p._id));
    let mainProducts = cleanedProducts.filter(p => !altIds.includes(String(p._id)));

    if (parsedIntent.intent !== "inventory" && outOfStockIds.length === 0) {
      mainProducts = cleanedProducts;
    }

    if (!mainProducts || mainProducts.length === 0) {
      mainProducts = cleanedProducts.slice(0, normalizedLimit);
    }

    return res.status(200).json({
      intent: parsedIntent.intent,
      reply: finalParsed.reply,
      products: mainProducts.slice(0, normalizedLimit),
      alternatives: alternativesProducts,
      comparisonSummary: finalParsed.comparisonSummary,
      meta: {
        page,
        searchQuery
      },
    });
  } catch (error) {
    console.error("RAG chat error:", error);
    if (error && error.isRateLimit) {
      if (error.permanentQuota) {
        const { message: userMessage = '', page = 'general', limit = 4 } = req.body || {};
        const normalizedLimit = Math.max(1, Math.min(Number(limit) || 4, 8));

        const offlineDetectIntent = (text) => {
          const t = (text || '').toLowerCase();
          if (/\b(who (are|r) you|what (are|r) you|how (are|r) you|your name|about you)\b/.test(t) || /^\s*(hi|hello|hey)\b/.test(t)) {
            return { intent: 'chitchat', searchQuery: '', reply: "Hi! I'm your AI shopping assistant (offline mode). I can search products from our catalog — try asking 'show running shoes'." };
          }
          if (/\b(compare| vs |versus|which is better)\b/.test(t)) {
            const words = t.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
            const nouns = words.filter(w => w.length > 3);
            return { intent: 'comparison', searchQuery: nouns.slice(0, 2).join(' '), reply: '' };
          }
          if (/\b(stock|in stock|sold out|available)\b/.test(t)) {
            const words = t.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
            const noun = words.find(w => w.length > 3) || '';
            return { intent: 'inventory', searchQuery: noun, reply: '' };
          }
          const words = t.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
          const candidate = words.find(w => w.length > 3) || words[0] || '';
          return { intent: 'discovery', searchQuery: candidate, reply: '' };
        };

        const parsedIntent = offlineDetectIntent(userMessage);

        let matchedProducts = [];
        if (userMessage && String(userMessage).trim()) {
          matchedProducts = await fuzzySearchProducts(userMessage, Math.max(normalizedLimit, 10));
        }

        if ((!matchedProducts || matchedProducts.length === 0) && parsedIntent.searchQuery && parsedIntent.searchQuery.trim().length > 2) {
          matchedProducts = await fuzzySearchProducts(parsedIntent.searchQuery, Math.max(normalizedLimit, 10));
        }

        if ((!matchedProducts || matchedProducts.length === 0) && parsedIntent.intent === 'discovery') {
          matchedProducts = await Product.find({}).limit(5).sort({ averageRating: -1 }).lean();
        }

        const pickedProducts = matchedProducts.slice(0, Math.max(normalizedLimit, 2));

        const reviewDocs = await Review.find({ productId: { $in: pickedProducts.map((p) => p._id).filter(Boolean) } }).select("productId title comment rating");
        const reviewMap = reviewDocs.reduce((acc, review) => {
          const key = String(review.productId);
          const list = acc.get(key) || [];
          list.push(review);
          acc.set(key, list);
          return acc;
        }, new Map());

        const enrichedProducts = mapProductsWithContext(pickedProducts.map(withDiscountedPrice), reviewMap);
        const cleanedProducts = enrichedProducts.map(p => {
          const { reviews, ...rest } = p;
          return rest;
        });

        let reply = '';
        let comparisonSummary = '';
        const alternatives = [];

        if (parsedIntent.intent === 'chitchat') {
          reply = parsedIntent.reply;
        } else if (cleanedProducts.length === 0) {
          reply = parsedIntent.searchQuery ? `I couldn't find products matching "${parsedIntent.searchQuery}". Try different keywords.` : "I couldn't find products right now. Try another query.";
        } else {
          const items = cleanedProducts.slice(0, normalizedLimit).map(p => `${p.name} (${p.discountedPrice || p.price} ETB)`);
          reply = `I found ${cleanedProducts.length} item(s): ${items.join(', ')}.`;
          if (parsedIntent.intent === 'comparison' && cleanedProducts.length >= 2) {
            const a = cleanedProducts[0];
            const b = cleanedProducts[1];
            comparisonSummary = `${a.name} is ${a.discountedPrice < b.discountedPrice ? 'cheaper' : 'more expensive'} than ${b.name}. ${a.name} has rating ${a.averageRating || 0}, ${b.name} has rating ${b.averageRating || 0}.`;
          }
        }

        return res.status(200).json({
          intent: parsedIntent.intent,
          reply,
          products: cleanedProducts.slice(0, normalizedLimit),
          alternatives,
          comparisonSummary: comparisonSummary || null,
          meta: { page, searchQuery: parsedIntent.searchQuery }
        });
      }

      const retryMs = error.retryAfterMs || 21000;
      const retrySeconds = Math.ceil(retryMs / 1000);
      res.set('Retry-After', String(retrySeconds));
      return res.status(429).json({ message: 'Rate limit exceeded', retry_after_seconds: retrySeconds });
    }

    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
