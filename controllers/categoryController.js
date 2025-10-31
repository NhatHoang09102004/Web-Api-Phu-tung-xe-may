import Category from "../models/Category.js";

// Lấy tất cả Category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách category",
      details: error.message,
    });
  }
};

// Lấy chi tiết 1 Category theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Không tìm thấy category" });
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy category", details: error.message });
  }
};

// Thêm 1 category
export const createCategory = async (req, res) => {
  try {
    const { name, vehicle, description, image } = req.body;
    if (!name || !vehicle)
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });

    const exists = await Category.findOne({ name, vehicle });
    if (exists) return res.status(400).json({ error: "Category đã tồn tại" });

    const category = new Category({ name, vehicle, description, image });
    await category.save();
    res
      .status(201)
      .json({ message: "Thêm category thành công", data: category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi thêm category", details: error.message });
  }
};

// Cập nhật category theo ID
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res
        .status(404)
        .json({ error: "Không tìm thấy category để cập nhật" });
    res
      .status(200)
      .json({ message: "Cập nhật category thành công", data: category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi cập nhật category", details: error.message });
  }
};

// Xóa 1 category theo ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Không tìm thấy category để xóa" });
    res.status(200).json({ message: "Đã xóa category thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa category", details: error.message });
  }
};

// Thêm nhiều category cùng lúc, bỏ qua duplicate name+vehicle
export const addMultipleCategories = async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Dữ liệu phải là mảng các category" });
    }

    // Lọc những item thiếu thông tin bắt buộc
    const invalidItems = categories.filter(c => !c.name || !c.vehicle);
    if (invalidItems.length > 0) {
      return res.status(400).json({
        error: "Một số category thiếu tên hoặc vehicle",
        details: invalidItems
      });
    }

    const added = [];
    const skipped = [];

    // Vòng lặp async để kiểm tra duplicate
    for (const c of categories) {
      // Check theo name + vehicle
      const exists = await Category.findOne({ name: c.name, vehicle: c.vehicle });
      if (exists) {
        skipped.push(c);
      } else {
        const newCategory = new Category(c);
        await newCategory.save();
        added.push(newCategory);
      }
    }

    res.status(201).json({
      message: "Thêm nhiều category hoàn tất",
      addedCount: added.length,
      skippedCount: skipped.length,
      added,
      skipped
    });

  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi thêm nhiều category",
      details: error.message
    });
  }
};
// Xóa nhiều category cùng lúc
export const deleteMultipleCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "Cần cung cấp mảng ID để xóa" });

    const result = await Category.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: "Đã xóa nhiều category thành công",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa nhiều category", details: error.message });
  }
};
