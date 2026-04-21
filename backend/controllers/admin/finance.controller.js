import asyncHandler from "express-async-handler";
import Order from "../../models/order.model.js";
import Transaction from "../../models/transaction.model.js";
import axios from "axios";

const SUCCESS_PAYMENT_STATUSES = new Set(["success", "successful", "paid", "completed", "complete"]);
const FAILED_PAYMENT_STATUSES = new Set(["failed", "cancelled", "canceled", "error", "expired"]);
const STALE_PENDING_MINUTES = Number(process.env.FINANCE_PENDING_FAIL_AFTER_MINUTES ?? 0);

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const parseMonetaryValue = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isSuccessfulStatus = (value) => SUCCESS_PAYMENT_STATUSES.has(normalizeStatus(value));

const isStalePending = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return true;

  const ageMs = Date.now() - date.getTime();
  return ageMs >= STALE_PENDING_MINUTES * 60 * 1000;
};

const normalizeFinanceStatus = (status, createdAt) => {
  const normalized = normalizeStatus(status);

  if (SUCCESS_PAYMENT_STATUSES.has(normalized)) return "success";
  if (FAILED_PAYMENT_STATUSES.has(normalized)) return "failed";

  if (normalized === "pending") {
    return isStalePending(createdAt) ? "failed" : "pending";
  }

  return "failed";
};

const resolveTransactionDate = (transaction) => {
  return (
    transaction?.createdAt ||
    transaction?.created_at ||
    transaction?.updatedAt ||
    transaction?.updated_at ||
    transaction?.date ||
    null
  );
};

const resolveTransactionAmount = (transaction) => {
  const amount = parseMonetaryValue(
    transaction?.amount ??
      transaction?.total_amount ??
      transaction?.paid_amount ??
      transaction?.charged_amount
  );

  if (amount > 0) return amount;

  const fallbackAmount = parseMonetaryValue(transaction?.orderId?.totalPrice);
  return fallbackAmount;
};

const extractChapaTransactions = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.transactions)) return payload.data.transactions;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.transactions)) return payload.transactions;
  return [];
};

const normalizeChapaTransaction = (transaction = {}, index = 0) => {
  const txRef =
    transaction?.tx_ref ||
    transaction?.reference ||
    transaction?.ref_id ||
    transaction?.id ||
    `chapa-${index}`;

  const resolvedStatus = normalizeStatus(
    transaction?.status || transaction?.payment_status || transaction?.transaction_status
  );
  const transactionDate = resolveTransactionDate(transaction);

  const firstName = transaction?.first_name || transaction?.customer?.first_name || "";
  const lastName = transaction?.last_name || transaction?.customer?.last_name || "";
  const customerName = `${firstName} ${lastName}`.trim();
  const customerEmail = transaction?.email || transaction?.customer?.email || "";

  return {
    _id: String(transaction?.id || txRef),
    tx_ref: String(txRef),
    amount: resolveTransactionAmount(transaction),
    currency: String(transaction?.currency || "ETB").toUpperCase(),
    status: normalizeFinanceStatus(resolvedStatus, transactionDate),
    chapa_reference: transaction?.reference || transaction?.chapa_reference || null,
    createdAt: transactionDate,
    userId: {
      _id: String(transaction?.customer?.id || customerEmail || txRef),
      name: customerName || customerEmail || "Chapa Customer",
    },
    source: "chapa",
  };
};

const toChapaDateParam = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const fetchChapaTransactions = async ({ fromDate, toDate, status } = {}) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) return [];

  const params = {};
  const normalizedFrom = toChapaDateParam(fromDate);
  const normalizedTo = toChapaDateParam(toDate);

  if (normalizedFrom) params.from_date = normalizedFrom;
  if (normalizedTo) params.to_date = normalizedTo;
  if (status) params.status = status;

  try {
    const response = await axios.get("https://api.chapa.co/v1/transactions", {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      params,
      timeout: 15000,
    });

    const transactions = extractChapaTransactions(response.data);
    return transactions.map(normalizeChapaTransaction);
  } catch {
    return [];
  }
};

const resolvePaymentStatus = (verifyResponse) => {
  const apiStatus = normalizeStatus(verifyResponse?.data?.status);
  const paymentStatus = normalizeStatus(verifyResponse?.data?.data?.status);
  const resolved = paymentStatus || apiStatus;

  if (SUCCESS_PAYMENT_STATUSES.has(resolved)) return "success";
  if (FAILED_PAYMENT_STATUSES.has(resolved)) return "failed";
  return "pending";
};

const syncPendingTransactionsWithChapa = async (transactions = []) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) return transactions;

  await Promise.all(
    transactions.map(async (transaction) => {
      if (!transaction?.tx_ref) return;

      const currentStatus = normalizeStatus(transaction.status);
      const hasValidAmount = parseMonetaryValue(transaction.amount) > 0;
      const hasCurrency = Boolean(transaction.currency);

      if (currentStatus !== "pending" && hasValidAmount && hasCurrency) return;

      try {
        const verifyResponse = await axios.get(
          `https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(transaction.tx_ref)}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );

        const latestStatus = resolvePaymentStatus(verifyResponse);
        const resolvedDate = resolveTransactionDate(transaction);

        const verifiedAmount = parseMonetaryValue(verifyResponse?.data?.data?.amount);
        if (verifiedAmount > 0) {
          transaction.amount = verifiedAmount;
        }

        const verifiedCurrency = verifyResponse?.data?.data?.currency;
        if (verifiedCurrency) {
          transaction.currency = String(verifiedCurrency).toUpperCase();
        }

        const chapaReference = verifyResponse?.data?.data?.reference;
        if (chapaReference && !transaction.chapa_reference) {
          transaction.chapa_reference = chapaReference;
        }

        const normalizedLatestStatus = normalizeFinanceStatus(latestStatus, resolvedDate);
        if (normalizedLatestStatus !== normalizeStatus(transaction.status)) {
          transaction.status = normalizedLatestStatus;
        }

        await transaction.save();

        if (normalizedLatestStatus === "success" && transaction.orderId) {
          await Order.findByIdAndUpdate(transaction.orderId, {
            paymentStatus: "paid",
            status: "paid",
          });
        } else if (normalizedLatestStatus === "failed" && transaction.orderId) {
          await Order.findByIdAndUpdate(transaction.orderId, {
            paymentStatus: "failed",
          });
        }
      } catch {
        // Keep pending status if verification call fails.
      }
    })
  );

  return transactions;
};


const getFinancialOverview = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const allTransactions = await Transaction.find(dateFilter)
    .populate("orderId", "totalPrice")
    .sort({ createdAt: -1 })
    .exec();

  await syncPendingTransactionsWithChapa(allTransactions);

  let paidTransactions = allTransactions.filter((transaction) => isSuccessfulStatus(transaction.status));

  if (paidTransactions.length === 0) {
    const chapaTransactions = await fetchChapaTransactions({
      fromDate: startDate,
      toDate: endDate,
      status: "success",
    });

    paidTransactions = chapaTransactions.filter((transaction) => isSuccessfulStatus(transaction.status));
  }

  const totalRevenue = paidTransactions.reduce((acc, transaction) => {
    return acc + resolveTransactionAmount(transaction);
  }, 0);

  const totalOrders = paidTransactions.length;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Mock data for now as we don't have this data
  const acquisitionCost = 28.15;
  const profitMargin = 32.4;

  res.status(200).json({
    totalRevenue,
    avgOrderValue,
    acquisitionCost,
    profitMargin,
  });
});


const getRevenueOverTime = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTransactions = await Transaction.find({
    createdAt: { $gte: sevenDaysAgo },
  })
    .populate("orderId", "totalPrice")
    .sort({ createdAt: -1 })
    .exec();

  await syncPendingTransactionsWithChapa(recentTransactions);

  let normalizedRecentTransactions = recentTransactions;
  const successfulLocalCount = recentTransactions.filter((transaction) => isSuccessfulStatus(transaction.status)).length;

  if (successfulLocalCount === 0) {
    const chapaTransactions = await fetchChapaTransactions({
      fromDate: sevenDaysAgo,
      toDate: new Date(),
      status: "success",
    });

    if (chapaTransactions.length > 0) {
      normalizedRecentTransactions = chapaTransactions;
    }
  }

  const revenueByDay = new Map();

  normalizedRecentTransactions.forEach((transaction) => {
    if (!isSuccessfulStatus(transaction.status)) return;

    const createdAt = new Date(resolveTransactionDate(transaction));
    if (Number.isNaN(createdAt.getTime())) return;

    const resolvedAmount = resolveTransactionAmount(transaction);

    const dayIndex = createdAt.getDay();
    revenueByDay.set(dayIndex, (revenueByDay.get(dayIndex) || 0) + resolvedAmount);
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyRevenue = days.map((day, index) => {
    return {
      day,
      revenue: revenueByDay.get(index) || 0,
    };
  });

  res.status(200).json(weeklyRevenue);
});

// @desc    Get orders vs refunds
// @route   GET /api/v1/admin/finance/orders-vs-refunds
// @access  Private/Admin
const getOrdersVsRefunds = asyncHandler(async (req, res) => {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const ordersData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: fourWeeksAgo },
      },
    },
    {
      $group: {
        _id: { $week: "$createdAt" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Mocking refunds for now
  const refundsData = ordersData.map((d) => ({
    _id: d._id,
    totalRefunds: Math.floor(d.totalOrders * 0.1), // 10% refund rate
  }));

  res.status(200).json({ ordersData, refundsData });
});


const getRecentTransactions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
  const query = {};

  if (status && status !== "All") {
    const normalizedStatus = String(status).toLowerCase();

    if (["pending", "success", "failed"].includes(normalizedStatus)) {
      query.status = normalizedStatus;
    }
  }

  const searchRegex = search ? new RegExp(search, "i") : null;

  if (searchRegex) {
    const allTransactions = await Transaction.find(query)
      .populate("userId", "name")
      .populate("orderId", "_id totalPrice")
      .sort({ createdAt: -1 })
      .exec();

    await syncPendingTransactionsWithChapa(allTransactions);

    const filteredTransactions = allTransactions.filter((transaction) =>
      searchRegex.test(transaction.userId?.name || "") ||
      searchRegex.test(transaction.tx_ref || "")
    );

    const normalizedTransactions = filteredTransactions.map((transaction) => {
      const plain = typeof transaction.toObject === "function" ? transaction.toObject() : transaction;
      const amount = parseMonetaryValue(plain.amount);
      const fallbackAmount = parseMonetaryValue(plain?.orderId?.totalPrice);

      return {
        ...plain,
        amount: amount > 0 ? amount : fallbackAmount,
        status: normalizeFinanceStatus(plain.status, plain.createdAt),
      };
    });

    const totalCount = normalizedTransactions.length;
    const paginatedTransactions = filteredTransactions.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    const normalizedPaginatedTransactions = paginatedTransactions.map((transaction) => {
      const plain = typeof transaction.toObject === "function" ? transaction.toObject() : transaction;
      const amount = parseMonetaryValue(plain.amount);
      const fallbackAmount = parseMonetaryValue(plain?.orderId?.totalPrice);

      return {
        ...plain,
        amount: amount > 0 ? amount : fallbackAmount,
        status: normalizeFinanceStatus(plain.status, plain.createdAt),
      };
    });

    return res.status(200).json({
      transactions: normalizedPaginatedTransactions,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber) || 1,
      currentPage: pageNumber,
    });
  }

  const transactions = await Transaction.find(query)
    .populate("userId", "name")
    .populate("orderId", "_id totalPrice")
    .sort({ createdAt: -1 })
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .exec();

  await syncPendingTransactionsWithChapa(transactions);

  const normalizedTransactions = transactions.map((transaction) => {
    const plain = typeof transaction.toObject === "function" ? transaction.toObject() : transaction;
    const amount = parseMonetaryValue(plain.amount);
    const fallbackAmount = parseMonetaryValue(plain?.orderId?.totalPrice);

    return {
      ...plain,
      amount: amount > 0 ? amount : fallbackAmount,
      status: normalizeFinanceStatus(plain.status, plain.createdAt),
    };
  });

  const totalCount = await Transaction.countDocuments(query);

  if (totalCount === 0) {
    const chapaTransactions = await fetchChapaTransactions({
      status: query.status,
    });

    const filteredChapaTransactions = chapaTransactions.filter((transaction) => {
      if (query.status && normalizeStatus(transaction.status) !== query.status) {
        return false;
      }

      if (!searchRegex) return true;

      return (
        searchRegex.test(transaction.userId?.name || "") ||
        searchRegex.test(transaction.tx_ref || "") ||
        searchRegex.test(transaction.chapa_reference || "")
      );
    });

    filteredChapaTransactions.sort((a, b) => {
      const aTime = new Date(resolveTransactionDate(a) || 0).getTime();
      const bTime = new Date(resolveTransactionDate(b) || 0).getTime();
      return bTime - aTime;
    });

    const paginatedChapaTransactions = filteredChapaTransactions.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    return res.status(200).json({
      transactions: paginatedChapaTransactions,
      totalCount: filteredChapaTransactions.length,
      totalPages: Math.ceil(filteredChapaTransactions.length / limitNumber) || 1,
      currentPage: pageNumber,
    });
  }

  res.status(200).json({
    transactions: normalizedTransactions,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNumber) || 1,
    currentPage: pageNumber,
  });
});

export {
  getFinancialOverview,
  getRevenueOverTime,
  getOrdersVsRefunds,
  getRecentTransactions,
};