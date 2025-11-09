import "dotenv/config";

const key = "MONGODB_URI";
const val = process.env[key] || "";
if (!val) {
  console.warn(`⚠️  ${key} is EMPTY`);
  process.exit(0);
}

try {
  const u = new URL(val);
  if (u.password) u.password = "***";
  console.log(`${key} =`, u.toString());
} catch {
  console.log(`${key} (raw) =`, val.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@"));
}
