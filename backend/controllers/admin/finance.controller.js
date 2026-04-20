import asyncHandler from "express-async-handler";
import Order from "../../models/order.model.js";


const getFinancialOverview = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const paidOrders = await Order.find({
    paymentStatus: "Paid",
    ...dateFilter,
  });

  const totalRevenue = paidOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  const totalOrders = await Order.countDocuments(dateFilter);

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

  const revenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyRevenue = days.map((day, index) => {
    const data = revenueData.find((d) => d._id === index + 1);
    return {
      day,
      revenue: data ? data.totalRevenue : 0,
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
  const query = {};

  if (status && status !== "All") {
    query.status = status;
  }

  if (search) {
    query["user.name"] = { $regex: search, $options: "i" };
  }

  const transactions = await Order.find(query)
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Order.countDocuments(query);

  res.status(200).json({
    transactions,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export {
  getFinancialOverview,
  getRevenueOverTime,
  getOrdersVsRefunds,
  getRecentTransactions,
};