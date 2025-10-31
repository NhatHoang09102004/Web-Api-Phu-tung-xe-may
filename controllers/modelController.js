import Model from "../models/Model.js";

// 🔹 Lấy tất cả model
export const getAllModels = async (req, res) => {
  try {
    const models = await Model.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách model", details: error.message });
  }
};

// 🔹 Lấy 1 model theo ID
export const getModelById = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) return res.status(404).json({ error: "Không tìm thấy model" });
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin model", details: error.message });
  }
};

// 🔹 Thêm 1 model
export const createModel = async (req, res) => {
  try {
    const { name, vehicle, description, image } = req.body;
    if (!name || !vehicle)
      return res.status(400).json({ error: "Tên model và Vehicle là bắt buộc" });

    const model = new Model({ name, vehicle, description, image });
    await model.save();

    res.status(201).json({ message: "Thêm model thành công", data: model });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm model", details: error.message });
  }
};

// 🔹 Cập nhật model theo ID
export const updateModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!model) return res.status(404).json({ error: "Không tìm thấy model để cập nhật" });

    res.status(200).json({ message: "Cập nhật model thành công", data: model });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật model", details: error.message });
  }
};

// 🔹 Xóa 1 model theo ID
export const deleteModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) return res.status(404).json({ error: "Không tìm thấy model để xóa" });

    res.status(200).json({ message: "Đã xóa model thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa model", details: error.message });
  }
};

// 🔹 Thêm nhiều model cùng lúc
export const addMultipleModels = async (req, res) => {
  try {
    const models = req.body; // mảng JSON [{name, vehicle, description, image}, ...]
    if (!Array.isArray(models) || models.length === 0)
      return res.status(400).json({ error: "Dữ liệu phải là mảng các model" });

    const invalidItems = models.filter((m) => !m.name || !m.vehicle);
    if (invalidItems.length > 0) {
      return res.status(400).json({ error: "Một số model thiếu tên hoặc vehicle", details: invalidItems });
    }

    const result = await Model.insertMany(models);
    res.status(201).json({ message: "Thêm nhiều model thành công", data: result });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm nhiều model", details: error.message });
  }
};

// 🔹 Xóa nhiều model cùng lúc (theo mảng ID)
export const deleteMultipleModels = async (req, res) => {
  try {
    const { ids } = req.body; // { ids: ["id1", "id2", ...] }
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "Cần cung cấp mảng ID để xóa" });

    const result = await Model.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Đã xóa nhiều model thành công", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa nhiều model", details: error.message });
  }
};
