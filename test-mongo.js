import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI, DB_NAME } = process.env;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Đã kết nối MongoDB local thành công!");
  } catch (err) {
    console.error("❌ Lỗi MongoDB:", err.message);
  }
}

connectDB();
