import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toReviewResponse = (reviewDoc) => {
  const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;
  const authorName = review.userId?.name || "Anonymous";

  return {
    _id: review._id,
    productKey: review.productKey,
    productId: review.productId,
    userId: review.userId?._id || review.userId,
    rating: review.rating,
    title: review.title,
    content: review.comment,
    verified: Boolean(review.verifiedPurchase),
    author: authorName,
    date: formatDate(review.createdAt),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
};

const updateProductRatingStats = async ({ productKey, productId }) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productKey,
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats[0]?.averageRating || 0;
  const reviewCount = stats[0]?.reviewCount || 0;

  if (productId) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount,
    });
  }

  return {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount,
  };
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const product = isValidObjectId(id)
      ? await Product.findById(id).select("name averageRating reviewCount")
      : null;

    const reviews = await Review.find({ productKey: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const normalizedReviews = reviews.map(toReviewResponse);

    const fallbackSummary = reviews.reduce(
      (acc, item) => {
        acc.reviewCount += 1;
        acc.ratingSum += Number(item.rating) || 0;
        return acc;
      },
      { ratingSum: 0, reviewCount: 0 }
    );

    const fallbackAverage =
      fallbackSummary.reviewCount > 0
        ? Number((fallbackSummary.ratingSum / fallbackSummary.reviewCount).toFixed(1))
        : 0;

    return res.status(200).json({
      productKey: id,
      summary: {
        averageRating: Number(product?.averageRating ?? fallbackAverage),
        reviewCount: Number(product?.reviewCount ?? fallbackSummary.reviewCount),
      },
      reviews: normalizedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getReviewEligibility = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hasVerifiedPurchase = isValidObjectId(id)
      ? await Order.exists({
          userId: user._id,
          paymentStatus: "paid",
          "items.productId": id,
        })
      : false;

    return res.status(200).json({
      canReview: Boolean(hasVerifiedPurchase),
      message: hasVerifiedPurchase
        ? "Eligible to review"
        : "You can only rate and review products you have purchased and paid for.",
    });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const upsertProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, content } = req.body;
    const user = req.user;

    const product = isValidObjectId(id) ? await Product.findById(id) : null;

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Review content is required" });
    }

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedContent = content.trim();

    const hasVerifiedPurchase = isValidObjectId(id)
      ? await Order.exists({
          userId: user._id,
          paymentStatus: "paid",
          "items.productId": id,
        })
      : false;

    if (!hasVerifiedPurchase) {
      return res.status(403).json({
        message: "You can only rate and review products you have purchased and paid for.",
      });
    }

    const review = await Review.findOneAndUpdate(
      { productKey: id, userId: user._id },
      {
        productKey: id,
        productId: product?._id,
        rating: numericRating,
        title: trimmedTitle,
        comment: trimmedContent,
        verifiedPurchase: Boolean(hasVerifiedPurchase),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("userId", "name");

    const summary = await updateProductRatingStats({ productKey: id, productId: product?._id });

    return res.status(200).json({
      message: "Review saved successfully",
      summary,
      review: toReviewResponse(review),
    });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
