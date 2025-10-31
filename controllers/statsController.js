export const getOverview = async (req, res) => {
  try {
    const products = globalThis.__productsCache__ || []; // fallback an toàn nếu bạn tự gắn ở nơi khác

    const totalProducts = 120;

    let topBrand = "Honda";
    if (totalProducts > 0) {
      const brandCount = products.reduce((acc, p) => {
        const key = p?.vehicle || "Khác";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      topBrand =
        Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "Honda";
    }

    // ===== Doanh thu tháng & series (demo) =====
    // TODO: Nếu có Order model, thay bằng aggregate thật từ đơn hàng
    const monthlyRevenue = 98500000;
    const monthlyRevenueSeries = [
      45, 62, 70, 88, 97, 98, 91, 95, 110, 120, 125, 130,
    ];

    // ===== Khách hàng mới (demo) =====
    const newCustomers = 23;

    return res.json({
      totalProducts,
      monthlyRevenue,
      topBrand,
      newCustomers,
      monthlyRevenueSeries,
    });
  } catch (err) {
    console.error("stats/overview error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
