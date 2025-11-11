// controllers/statsController.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * GET /api/stats/overview
 * Response:
 * {
 *  totalProducts,
 *  totalStock,
 *  monthlyRevenueSeries: [12], // VND raw numbers, oldest->newest
 *  totalOrders,
 *  newCustomers,
 *  totalByBrand: { brand: qty },
 *  categoryDistribution: { category: count },
 *  topLowStock: [{_id,name,vehicle,model,category,quantity,image}],
 *  topBrand
 * }
 */
export async function overview(req, res) {
  try {
    const now = new Date();
    // start from first day 11 months ago -> includes this month (12 months)
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // 1) total products & total stock
    const totalProducts = await Product.countDocuments();
    const stockAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: { $ifNull: ["$quantity", 0] } } } },
    ]);
    const totalStock = stockAgg[0]?.totalStock || 0;

    // 2) total by brand (vehicle) and category distribution
    const brandAgg = await Product.aggregate([
      { $group: { _id: "$vehicle", qty: { $sum: { $ifNull: ["$quantity", 0] } } } },
    ]);
    const totalByBrand = {};
    brandAgg.forEach((r) => (totalByBrand[r._id || "Khác"] = r.qty));

    const catAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const categoryDistribution = {};
    catAgg.forEach((r) => (categoryDistribution[r._id || "Khác"] = r.count));

    // 3) monthly revenue series (last 12 months)
    const orderAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, status: { $in: ["paid", "completed", "finished", "paid_off", "done", "success"] } } },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          amount: { $ifNull: ["$totalAmount", "$total", 0] },
        },
      },
      { $group: { _id: { year: "$year", month: "$month" }, total: { $sum: "$amount" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // build 12-element array aligned from oldest -> newest
    const monthlyRevenueSeries = Array(12).fill(0);
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const y = d.getFullYear(), m = d.getMonth() + 1;
      const row = orderAgg.find((r) => r._id.year === y && r._id.month === m);
      monthlyRevenueSeries[i] = row ? row.total : 0;
    }

    // 4) totals orders & new customers (phone distinct in last 30 days)
    const totalOrders = await Order.countDocuments();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const newCustomersArr = await Order.distinct("customer.phone", { createdAt: { $gte: thirtyDaysAgo } });
    const newCustomers = (newCustomersArr || []).filter(Boolean).length;

    // 5) top low stock (5 lowest quantity)
    const topLowStock = await Product.find({}, { name: 1, vehicle: 1, model: 1, category: 1, quantity: 1, image: 1 })
      .sort({ quantity: 1 })
      .limit(5)
      .lean();

    // 6) topBrand (brand by highest stock sum)
    let topBrand = null;
    let maxQty = -1;
    for (const [b, q] of Object.entries(totalByBrand)) {
      if (q > maxQty) { maxQty = q; topBrand = b; }
    }

    return res.json({
      totalProducts,
      totalStock,
      monthlyRevenueSeries,
      totalOrders,
      newCustomers,
      totalByBrand,
      categoryDistribution,
      topLowStock,
      topBrand,
    });
  } catch (err) {
    console.error("stats.overview error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
