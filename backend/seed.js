// Creates a default Admin user so you can log in immediately.
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "admin@transitops.com" });
  if (existing) {
    console.log("Admin user already exists: admin@transitops.com");
    process.exit(0);
  }

  await User.create({
    name: "Admin",
    email: "admin@transitops.com",
    password: "admin123",
    role: "Admin",
  });

  console.log("Admin user created:");
  console.log("  email: admin@transitops.com");
  console.log("  password: admin123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
