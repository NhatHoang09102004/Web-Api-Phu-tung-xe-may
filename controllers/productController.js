// controllers/productController.js
import Product from "../models/Product.js";
import mongoose from "mongoose";

/**
 * GET /api/products
 * phân trang + tìm kiếm + lọc + sắp xếp
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      vehicle,
      category,
      model,
      status,
      q,
      price_min,
      price_max,
      year,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const lim = Math.min(100, Math.max(1, Number(limit)));

    // build filter
    const filters = {};
    if (vehicle) filters.vehicle = vehicle;
    if (category) filters.category = category;
    if (model) filters.model = model;
    if (status) filters.status = status;
    if (year) filters.year = year;
    if (q) {
      // dùng text nếu có, fallback regex
      // assumes text index exists
      filters.$text = { $search: q };
    }
    if (price_min || price_max) {
      filters.price = {};
      if (price_min) filters.price.$gte = Number(price_min);
      if (price_max) filters.price.$lte = Number(price_max);
    }

    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    // total count (chi phí 1 query)
    const totalItems = await Product.countDocuments(filters);

    // projection: trả những trường UI cần (giảm payload)
    const projection =
      "name price vehicle model category quantity image status createdAt";

    const products = await Product.find(filters)
      .select(projection)
      .sort(sortObj)
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .lean();

    // sửa status theo quantity
    const data = products.map((p) =>
      typeof p.quantity === "number" && p.quantity <= 0
        ? { ...p, status: "Hết hàng" }
        : p
    );

    res.status(200).json({
      page: pageNum,
      limit: lim,
      totalPages: Math.ceil(totalItems / lim),
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
      data,
    });
  } catch (error) {
    console.error("getAllProducts:", error);
    res.status(500).json({
      error: "Lỗi khi lấy danh sách sản phẩm",
      details: error.message,
    });
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID không hợp lệ" });

    const product = await Product.findById(id).lean();
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    if (typeof product.quantity === "number" && product.quantity <= 0) {
      product.status = "Hết hàng";
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("getProductById:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy sản phẩm", details: error.message });
  }
};

/**
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const { name, vehicle, model, category, price } = req.body;
    if (!name || !vehicle || !model || !category || price == null) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const product = new Product(req.body);
    await product.save();
    return res
      .status(201)
      .json({ message: "Thêm sản phẩm thành công", data: product });
  } catch (error) {
    console.error("createProduct:", error);
    // duplicate key? (nếu bật unique index)
    return res
      .status(500)
      .json({ error: "Lỗi khi thêm sản phẩm", details: error.message });
  }
};

/**
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID không hợp lệ" });

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product)
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm để cập nhật" });
    return res
      .status(200)
      .json({ message: "Cập nhật sản phẩm thành công", data: product });
  } catch (error) {
    console.error("updateProduct:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi cập nhật sản phẩm", details: error.message });
  }
};

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "ID không hợp lệ" });

    const product = await Product.findByIdAndDelete(id).lean();
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
    return res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    console.error("deleteProduct:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi xóa sản phẩm", details: error.message });
  }
};

/**
 * POST /api/products/bulk-insert
 * Thêm nhiều sản phẩm cùng lúc.
 * Giải pháp: dùng bulkWrite + upsert:$setOnInsert để bỏ qua duplicates (không cập nhật).
 */
export const addMultipleProducts = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Dữ liệu phải là mảng các sản phẩm" });
    }

    const invalid = products.filter(
      (p) => !p.name || !p.vehicle || !p.model || !p.category || p.price == null
    );
    if (invalid.length) {
      return res
        .status(400)
        .json({
          error: "Một số sản phẩm thiếu thông tin bắt buộc",
          details: invalid,
        });
    }

    // prepare bulk ops: dùng compound key (name, vehicle, model, category)
    const ops = products.map((p) => {
      const filter = {
        name: p.name,
        vehicle: p.vehicle,
        model: p.model,
        category: p.category,
      };
      return {
        updateOne: {
          filter,
          update: { $setOnInsert: p },
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(ops, { ordered: false });
    // result.upsertedCount là số bản ghi thêm mới
    const upserted = result.upsertedCount || 0;

    // compute skipped = input - upserted (approx)
    const skipped = products.length - upserted;

    // Fetch the newly added documents for response preview (optional, limited)
    // Note: bulkWrite doesn't return docs, so we can query by recently added createdAt range if needed.
    return res.status(201).json({
      message: "Thêm nhiều sản phẩm hoàn tất",
      requested: products.length,
      addedCount: upserted,
      skippedCount: skipped,
      resultSummary: result,
    });
  } catch (error) {
    console.error("addMultipleProducts:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi thêm nhiều sản phẩm", details: error.message });
  }
};

/**
 * POST /api/products/delete-multiple
 */
export const deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "Cần cung cấp mảng ID để xóa" });

    const result = await Product.deleteMany({ _id: { $in: ids } });
    return res
      .status(200)
      .json({
        message: "Đã xóa nhiều sản phẩm thành công",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("deleteMultipleProducts:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi xóa nhiều sản phẩm", details: error.message });
  }
};
