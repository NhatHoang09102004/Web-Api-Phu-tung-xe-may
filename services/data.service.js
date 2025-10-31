import { Low } from "lowdb";
import { nanoid } from "nanoid";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// 🧭 Định nghĩa đường dẫn file JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, "../data/db.json");

// 🧠 Tạo adapter JSONFile tùy chỉnh
class JSONFile {
  constructor(filename) {
    this.filename = filename;
  }

  async read() {
    try {
      const data = await readFile(this.filename, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  async write(data) {
    await writeFile(this.filename, JSON.stringify(data, null, 2));
  }
}

const adapter = new JSONFile(file);
const db = new Low(adapter, { products: [] });

async function init() {
  await db.read();
  db.data ||= { products: [] };
  await db.write();
}

// 🧰 CRUD
export async function getAll() {
  await init();
  return db.data.products;
}

export async function getById(id) {
  await init();
  return db.data.products.find((p) => p.id === id);
}

export async function create(data) {
  await init();
  const newItem = { id: nanoid(6), ...data };
  db.data.products.push(newItem);
  await db.write();
  return newItem;
}

export async function update(id, data) {
  await init();
  const idx = db.data.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.data.products[idx] = { ...db.data.products[idx], ...data };
  await db.write();
  return db.data.products[idx];
}

export async function remove(id) {
  await init();
  db.data.products = db.data.products.filter((p) => p.id !== id);
  await db.write();
  return true;
}
