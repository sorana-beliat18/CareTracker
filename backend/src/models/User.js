import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    mfaSecret: { type: String, select: false },
    mfaEnabled: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["patient", "receptionist", "doctor"],
      required: true,
      default: "patient"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
