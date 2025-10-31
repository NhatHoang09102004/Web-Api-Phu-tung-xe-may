import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicle: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

// Compound index: name + vehicle unique
categorySchema.index({ name: 1, vehicle: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
