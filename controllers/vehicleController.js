import Vehicle from "../models/Vehicle.js";

// 🔹 Lấy tất cả dòng xe
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách xe", details: error.message });
  }
};

// 🔹 Lấy 1 dòng xe theo ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Không tìm thấy xe" });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin xe", details: error.message });
  }
};

// 🔹 Thêm 1 dòng xe
export const createVehicle = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ error: "Tên xe là bắt buộc" });

    const vehicle = new Vehicle({ name, description, image });
    await vehicle.save();

    res.status(201).json({ message: "Thêm dòng xe thành công", data: vehicle });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm xe", details: error.message });
  }
};

// 🔹 Cập nhật 1 dòng xe theo ID
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ error: "Không tìm thấy xe để cập nhật" });

    res.status(200).json({ message: "Cập nhật dòng xe thành công", data: vehicle });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật xe", details: error.message });
  }
};

// 🔹 Xóa 1 dòng xe theo ID
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Không tìm thấy xe để xóa" });

    res.status(200).json({ message: "Đã xóa dòng xe thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa xe", details: error.message });
  }
};

// 🔹 Thêm nhiều dòng xe cùng lúc
export const addMultipleVehicles = async (req, res) => {
  try {
    const vehicles = req.body; // mảng JSON [{name, description, image}, ...]
    if (!Array.isArray(vehicles) || vehicles.length === 0)
      return res.status(400).json({ error: "Dữ liệu phải là mảng các xe" });

    const invalidItems = vehicles.filter((v) => !v.name);
    if (invalidItems.length > 0) {
      return res.status(400).json({ error: "Một số xe thiếu tên", details: invalidItems });
    }

    const result = await Vehicle.insertMany(vehicles);
    res.status(201).json({ message: "Thêm nhiều dòng xe thành công", data: result });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm nhiều xe", details: error.message });
  }
};

// 🔹 Xóa nhiều dòng xe cùng lúc (theo mảng ID)
export const deleteMultipleVehicles = async (req, res) => {
  try {
    const { ids } = req.body; // { ids: ["id1", "id2", ...] }
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "Cần cung cấp mảng ID để xóa" });

    const result = await Vehicle.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Đã xóa nhiều dòng xe thành công", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa nhiều xe", details: error.message });
  }
};
