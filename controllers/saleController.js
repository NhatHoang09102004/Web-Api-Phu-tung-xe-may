// // controllers/saleController.js
// import mongoose from "mongoose";
// import Sale from "../models/Sale.js";
// import Product from "../models/Product.js";

// /**
//  * POST /api/sales
//  * body: {
//  *   items: [{ productId, quantity }],
//  *   paymentMethod?,
//  *   customer?: { name, phone, address },
//  *   cashier?: string,
//  *   reduceStock?: boolean (default true)
//  * }
//  */
// export async function createSale(req, res) {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { items = [], paymentMethod = "COD", customer = {}, cashier = "POS", reduceStock = true } = req.body;
//     if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "items required" });

//     // Fetch products
//     const ids = items.map((it) => it.productId);
//     const products = await Product.find({ _id: { $in: ids } }).session(session);
//     const prodMap = {};
//     products.forEach((p) => (prodMap[p._id.toString()] = p));

//     // Build sale items, check stock
//     let total = 0;
//     const saleItems = [];
//     for (const it of items) {
//       const prod = prodMap[it.productId];
//       const qty = Math.max(0, Number(it.quantity || 0));
//       if (!prod) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Product not found: ${it.productId}` });
//       }
//       // ensure enough stock
//       if (reduceStock && (prod.quantity == null ? 0 : prod.quantity) < qty) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Không đủ tồn cho ${prod.name}` });
//       }
//       const price = Number(prod.price || 0);
//       total += price * qty;
//       saleItems.push({
//         productId: prod._id,
//         name: prod.name,
//         price,
//         quantity: qty,
//         image: prod.image || "",
//       });
//     }

//     // create saleId simple
//     const saleId = `S-${Date.now().toString(36).toUpperCase().slice(-8)}`;

//     // create sale document
//     const [newSale] = await Sale.create([{ saleId, items: saleItems, totalAmount: total, paymentMethod, customer, cashier }], { session });

//     // reduce stock
//     if (reduceStock) {
//       for (const it of saleItems) {
//         await Product.findByIdAndUpdate(it.productId, { $inc: { quantity: -it.quantity } }, { session });
//       }
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(201).json({ message: "Bán hàng thành công", sale: newSale });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("createSale error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// }

// /**
//  * GET /api/sales
//  * supports: page, limit, from, to, q
//  */
// export async function listSales(req, res) {
//   try {
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 20));
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (req.query.from || req.query.to) {
//       filter.createdAt = {};
//       if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
//       if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
//     }
//     if (req.query.q) {
//       const q = req.query.q.trim();
//       filter.$or = [{ saleId: { $regex: q, $options: "i" } }, { "customer.name": { $regex: q, $options: "i" } }];
//     }

//     const [items, totalItems] = await Promise.all([
//       Sale.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
//       Sale.countDocuments(filter),
//     ]);

//     return res.json({ data: items, page, totalPages: Math.ceil(totalItems / limit), totalItems });
//   } catch (err) {
//     console.error("listSales error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// }

// export async function getSaleById(req, res) {
//   try {
//     const s = await Sale.findById(req.params.id).lean();
//     if (!s) return res.status(404).json({ error: "Not found" });
//     return res.json(s);
//   } catch (err) {
//     console.error("getSaleById error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// }
