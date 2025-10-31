import Product from "../models/Product.js";

// 🧾 Lấy tất cả sản phẩm (phân trang + tìm kiếm + lọc + sắp xếp)
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1, // Trang hiện tại
      limit = 10, // Số lượng mỗi trang
      sort = "createdAt", // Trường sắp xếp (vd: price, name, createdAt)
      order = "desc", // Hướng sắp xếp: asc / desc
      vehicle, // Lọc theo hãng xe
      category, // Lọc theo loại phụ tùng
      model, // Lọc theo dòng xe
      status, // Lọc theo trạng thái
      q, // Tìm kiếm theo tên
      price_min, // Giá thấp nhất
      price_max, // Giá cao nhất
      year, // Lọc theo năm sản xuất
    } = req.query;

    // 🎯 Điều kiện lọc động
    const query = {};

    if (vehicle) query.vehicle = vehicle;
    if (category) query.category = category;
    if (model) query.model = model;
    if (status) query.status = status;
    if (q) query.name = { $regex: q, $options: "i" };
    if (year) query.year = year;

    // 💰 Lọc theo khoảng giá
    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = Number(price_min);
      if (price_max) query.price.$lte = Number(price_max);
    }

    // 🧮 Tổng số sản phẩm khớp điều kiện
    const totalItems = await Product.countDocuments(query);

    // 📦 Lấy dữ liệu phân trang
    let products = await Product.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(); // dùng lean() để tối ưu & dễ chỉnh sửa dữ liệu

    // ⚙️ Xử lý trạng thái "Hết hàng" cho sản phẩm tồn kho = 0
    products = products.map((p) => {
      if (typeof p.quantity === "number" && p.quantity <= 0) {
        return { ...p, status: "Hết hàng" };
      }
      return p;
    });

    // ✅ Kết quả trả về
    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      sort,
      order,
      filters: {
        vehicle,
        category,
        model,
        status,
        q,
        price_min,
        price_max,
        year,
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách sản phẩm",
      details: error.message,
    });
  }
};

// 🔍 Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi lấy sản phẩm",
      details: error.message,
    });
  }
};

// ➕ Thêm 1 sản phẩm
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      vehicle,
      model,
      category,
      price,
      description,
      year,
      specifications,
      quantity,
      origin,
      image,
      status,
    } = req.body;

    if (!name || !vehicle || !model || !category || !price)
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });

    const product = new Product({
      name,
      vehicle,
      model,
      category,
      price,
      description,
      year,
      specifications,
      quantity,
      origin,
      image,
      status,
    });

    await product.save();
    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi thêm sản phẩm",
      details: error.message,
    });
  }
};

// ✏️ Cập nhật sản phẩm theo ID
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product)
      return res.status(404).json({
        error: "Không tìm thấy sản phẩm để cập nhật",
      });

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi cập nhật sản phẩm",
      details: error.message,
    });
  }
};

// 🗑️ Xóa 1 sản phẩm theo ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({
        error: "Không tìm thấy sản phẩm để xóa",
      });

    res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi xóa sản phẩm",
      details: error.message,
    });
  }
};

// 📥 Thêm nhiều sản phẩm cùng lúc (bỏ qua duplicate name + vehicle + model + category)
export const addMultipleProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Dữ liệu phải là mảng các sản phẩm" });
    }

    const invalidItems = products.filter(
      (p) => !p.name || !p.vehicle || !p.model || !p.category || !p.price
    );
    if (invalidItems.length > 0) {
      return res.status(400).json({
        error: "Một số sản phẩm thiếu thông tin bắt buộc",
        details: invalidItems,
      });
    }

    const added = [];
    const skipped = [];

    for (const p of products) {
      const exists = await Product.findOne({
        name: p.name,
        vehicle: p.vehicle,
        model: p.model,
        category: p.category,
      });

      if (exists) {
        skipped.push(p);
      } else {
        const newProduct = new Product(p);
        await newProduct.save();
        added.push(newProduct);
      }
    }

    res.status(201).json({
      message: "Thêm nhiều sản phẩm hoàn tất",
      addedCount: added.length,
      skippedCount: skipped.length,
      added,
      skipped,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi thêm nhiều sản phẩm",
      details: error.message,
    });
  }
};

// 🗑️ Xóa nhiều sản phẩm cùng lúc
export const deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "Cần cung cấp mảng ID để xóa" });

    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: "Đã xóa nhiều sản phẩm thành công",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi xóa nhiều sản phẩm",
      details: error.message,
    });
  }
};
