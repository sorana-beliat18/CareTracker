import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../backend/src/models/User.js";
import Notification from "../backend/src/models/Notification.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

const uri = process.env.MONGODB_URI;

async function seed() {
  if (!uri) throw new Error("MONGODB_URI is not configured");

  await mongoose.connect(uri, {
    dbName: process.env.DATABASE_NAME || "caretracker"
  });

  await Promise.all([User.deleteMany({}), Notification.deleteMany({})]);

  const users = [
    { name: "Demo Patient", email: "patient@caretracker.local", role: "patient" },
    { name: "Demo Receptionist", email: "reception@caretracker.local", role: "receptionist" },
    { name: "Demo Doctor", email: "doctor@caretracker.local", role: "doctor" }
  ];

  const passwordHash = await bcrypt.hash("CareTracker123!", 12);
  const createdUsers = await User.insertMany(
    users.map((user) => ({ ...user, passwordHash }))
  );

  await Notification.create({
    userId: createdUsers[0]._id,
    message: "Welcome to CareTracker. Your account is ready."
  });

  console.log("Seed completed.");
  console.log("Password for demo accounts: CareTracker123!");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
