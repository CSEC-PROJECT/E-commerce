import asyncHandler from "express-async-handler";
import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import Product from "../../models/product.model.js";



const getDashboardStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const totalSalesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalOrdersData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const pendingOrders = await Order.countDocuments({
    status: "pending",
    createdAt: { $gte: sevenDaysAgo },
  });

  const cancelledOrders = await Order.countDocuments({
    paymentStatus: "failed",
    createdAt: { $gte: sevenDaysAgo },
  });

  const newCustomers = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const activeProducts = await Product.countDocuments({
    stock: { $gt: 0 },
  });

  const grossRevenue = totalSalesData[0]?.totalSales || 0;

  res.status(200).json({
    totalSales: totalSalesData[0]?.totalSales || 0,
    totalOrders: totalOrdersData[0]?.totalOrders || 0,
    pendingOrders,
    cancelledOrders,
    newCustomers,
    activeProducts,
    grossRevenue,
  });
});


const getWeeklySalesPerformance = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklySales = days.map((day, index) => {
    const sale = salesData.find((s) => s._id === index + 1);
    return {
      day,
      sales: sale ? sale.totalSales : 0,
    };
  });

  res.status(200).json(weeklySales);
});


const getRecentTransactions = asyncHandler(async (req, res) => {
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name");
  res.status(200).json(recentOrders);
});


const getBestSellingProducts = asyncHandler(async (req, res) => {
  const bestSelling = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalOrdered: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { totalOrdered: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
  ]);

  res.status(200).json(bestSelling);
});

export {
  getDashboardStats,
  getWeeklySalesPerformance,
  getRecentTransactions,
  getBestSellingProducts,
};