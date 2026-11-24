import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createTotpSecret,
  getManualKey,
  getOtpAuthUrl,
  verifyTotpCode
} from "../utils/totp.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function createMfaChallenge(user, purpose) {
  return jwt.sign(
    { sub: user.id, purpose },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );
}

function mfaSetupResponse(user, encryptedSecret) {
  return {
    mfaSetupRequired: true,
    challengeToken: createMfaChallenge(user, "mfa-setup"),
    otpAuthUrl: getOtpAuthUrl(user.email, encryptedSecret),
    manualKey: getManualKey(encryptedSecret)
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role = "patient" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (!["patient", "receptionist", "doctor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const mfa = createTotpSecret(email.toLowerCase().trim());
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      mfaSecret: mfa.encryptedSecret,
      mfaEnabled: false,
      role
    });

    res.status(201).json({
      ...mfaSetupResponse(user, mfa.encryptedSecret),
      manualKey: mfa.manualKey
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+passwordHash +mfaSecret");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.mfaEnabled) {
      const mfa = createTotpSecret(user.email);
      user.mfaSecret = mfa.encryptedSecret;
      await user.save();
      return res.json(mfaSetupResponse(user, user.mfaSecret));
    }

    res.json({
      mfaRequired: true,
      challengeToken: createMfaChallenge(user, "mfa-login")
    });
  } catch (error) {
    next(error);
  }
});

router.post("/mfa/verify", async (req, res, next) => {
  try {
    const { challengeToken, code } = req.body;
    if (!challengeToken || !code) {
      return res.status(400).json({ message: "Challenge token and six-digit code are required" });
    }

    let challenge;
    try {
      challenge = jwt.verify(challengeToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "The verification session expired. Please start again." });
    }

    if (!["mfa-setup", "mfa-login"].includes(challenge.purpose)) {
      return res.status(401).json({ message: "Invalid verification session" });
    }

    const user = await User.findById(challenge.sub).select("+mfaSecret");
    if (!user || !user.mfaSecret) {
      return res.status(401).json({ message: "MFA setup is no longer available. Please sign in again." });
    }
    if (challenge.purpose === "mfa-login" && !user.mfaEnabled) {
      return res.status(401).json({ message: "MFA is not enabled. Please sign in again." });
    }
    if (!verifyTotpCode(user.mfaSecret, code)) {
      return res.status(401).json({ message: "Invalid authenticator code" });
    }

    if (challenge.purpose === "mfa-setup") {
      user.mfaEnabled = true;
      await user.save();
    }

    res.json({
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

export default router;
