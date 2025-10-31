module.exports = (err, req, res, next) => {
  console.error("❌ Lỗi:", err);
  res.status(500).json({ message: "Đã xảy ra lỗi server", error: err.message });
};