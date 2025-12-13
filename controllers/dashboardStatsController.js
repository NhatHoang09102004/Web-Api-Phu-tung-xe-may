import Product from "../models/Product.js";

export const getOverviewStats = async (req, res) => {
  try {
    // 1. Tổng sản phẩm
    const totalProducts = await Product.countDocuments();

    // 2. Doanh thu tháng (demo)
    const products = await Product.find({}, "price quantity");
    const monthlyRevenue = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
      0
    );

    // 3. Hãng phổ biến
    const popularBrandAgg = await Product.aggregate([
      { $group: { _id: "$vehicle", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const popularBrand =
      popularBrandAgg.length > 0
        ? { name: popularBrandAgg[0]._id, count: popularBrandAgg[0].count }
        : { name: null, count: 0 };

    // 4. Khách hàng mới (demo)
    const newCustomers = Math.floor(Math.random() * 40) + 10;

    // Trả về JSON
    return res.status(200).json({
      success: true,
      totalProducts,
      monthlyRevenue,
      popularBrand,
      newCustomers,
    });
  } catch (error) {
    console.error("getOverviewStats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi lấy thống kê tổng quan",
      error: error.message,
    });
  }
};
