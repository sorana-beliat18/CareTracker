import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import speakeasy from "speakeasy";

function getEncryptionKey() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is not configured");
  return createHash("sha256").update(`${jwtSecret}:caretracker-totp`).digest();
}

export function createTotpSecret(email) {
  const secret = speakeasy.generateSecret({ name: `CareTracker:${email}`, issuer: "CareTracker" });
  return {
    encryptedSecret: encryptSecret(secret.base32),
    otpAuthUrl: secret.otpauth_url,
    manualKey: secret.base32
  };
}

export function verifyTotpCode(encryptedSecret, code) {
  if (!/^\d{6}$/.test(code || "")) return false;
  return speakeasy.totp.verify({
    secret: decryptSecret(encryptedSecret),
    encoding: "base32",
    token: code,
    window: 1
  });
}

export function getManualKey(encryptedSecret) {
  return decryptSecret(encryptedSecret);
}

export function getOtpAuthUrl(email, encryptedSecret) {
  return speakeasy.otpauthURL({
    secret: decryptSecret(encryptedSecret),
    label: email,
    issuer: "CareTracker",
    encoding: "base32"
  });
}

function encryptSecret(secret) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("hex")).join(":");
}

function decryptSecret(value) {
  const [ivHex, tagHex, encryptedHex] = value.split(":");
  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Stored MFA secret has an invalid format");
  }
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]).toString("utf8");
}
