// import Order from "../models/Order.js";

// /**
//  * GET /api/stats/revenue-monthly
//  * Tính doanh thu theo 12 tháng + tổng doanh thu
//  */
// export const getRevenueMonthly = async (req, res) => {
//   try {
//     const result = await Order.aggregate([
//       {
//         $group: {
//           _id: { month: { $month: "$createdAt" } },
//           totalRevenue: { $sum: "$totalPrice" }
//         }
//       },
//       { $sort: { "_id.month": 1 } }
//     ]);

//     const months = [];
//     const revenue = [];

//     for (let i = 1; i <= 12; i++) {
//       const found = result.find(r => r._id.month === i);
//       months.push("Th" + i);
//       revenue.push(found ? found.totalRevenue : 0);
//     }

//     const totalRevenue = revenue.reduce((a, b) => a + b, 0);

//     res.json({
//       months,
//       revenue,
//       totalRevenue
//     });
//   } catch (err) {
//     console.error("getRevenueMonthly error:", err);
//     res.status(500).json({ error: "Lỗi khi thống kê doanh thu", details: err.message });
//   }
// };

// data fake 
import { fakeRevenueData } from "../fake/fakeRevenue.js";

export const getRevenueMonthly = async (req, res) => {
  try {
    const revenue = fakeRevenueData; // DÙNG DATA GIẢ
    const months = Array.from({ length: 12 }, (_, i) => "Th" + (i + 1));
    const totalRevenue = revenue.reduce((a, b) => a + b, 0);

    return res.json({
      months,
      revenue,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu doanh thu giả" });
  }
};
