import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(uri, {
    dbName: process.env.DATABASE_NAME || "caretracker"
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
