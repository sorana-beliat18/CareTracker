import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Notification from "./src/models/Notification.js";

const uri = process.env.MONGODB_URI;

async function seed() {
  if (!uri) throw new Error("MONGODB_URI is not configured");

  await mongoose.connect(uri, {
    dbName: process.env.DATABASE_NAME || "caretracker"
  });

  const users = [
    { name: "Demo Patient", email: "patient@caretracker.local", role: "patient" },
    { name: "Demo Receptionist", email: "reception@caretracker.local", role: "receptionist" },
    { name: "Demo Doctor", email: "doctor@caretracker.local", role: "doctor" }
  ];

  const passwordHash = await bcrypt.hash("CareTracker123!", 12);
  let patientCreated = false;
  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) continue;

    const user = await User.create({ ...userData, passwordHash, mfaEnabled: false });
    if (user.role === "patient") {
      await Notification.create({
        userId: user._id,
        message: "Welcome to CareTracker. Your account is ready."
      });
      patientCreated = true;
    }
  }

  console.log("Seed completed. Existing user and notification records were preserved.");
  if (patientCreated) {
    console.log("Password for newly created demo accounts: CareTracker123!");
  }
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
