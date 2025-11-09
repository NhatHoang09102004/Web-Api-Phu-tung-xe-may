import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js"; // đổi path theo dự án

await mongoose.connect(process.env.MONGODB_URI, { dbName: "motorparts" });

await Product.deleteMany({});
await Product.insertMany([
  { name: "Lọc dầu", price: 120000 },
  { name: "Nhớt 10W-40", price: 180000 },
]);

console.log("✅ Seed xong");
await mongoose.disconnect();
process.exit(0);
