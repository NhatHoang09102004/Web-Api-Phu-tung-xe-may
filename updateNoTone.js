import mongoose from "mongoose";
import Product from "./models/Product.js";
import { removeVietnameseTone } from "./utils/stringUtils.js";

await mongoose.connect(
  "mongodb+srv://hoangndnps33773_db_user:ayenl123@apiphutung.dfvf2od.mongodb.net/motorparts?retryWrites=true&w=majority&appName=apiphutung"
);

const products = await Product.find();
for (let p of products) {
  p.nameNoTone = removeVietnameseTone(p.name);
  await p.save();
}

console.log("DONE update nameNoTone!");
process.exit(0);
