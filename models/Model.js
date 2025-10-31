import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // Tên xe, ví dụ: Wave RSX
    vehicle: { type: String, required: true },      // Vehicle: Honda/Yamaha/SYM
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Model = mongoose.model("Model", modelSchema);
export default Model;
