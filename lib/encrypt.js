import crypto from "crypto";


export function encrypt(text) {
    const algorithm = "aes-256-gcm";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.MASTER_KEY)
  .digest(); // 32 bytes

  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(encryptedText) {
    const algorithm = "aes-256-gcm";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.MASTER_KEY)
  .digest(); // 32 bytes

  const data = Buffer.from(encryptedText, "base64");

  const iv = data.slice(0, 12);
  const authTag = data.slice(12, 28);
  const encrypted = data.slice(28);

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}


export function hashEmail(email) {
  return crypto
    .createHmac("sha256", process.env.MASTER_KEY)
    .update(email.toLowerCase().trim())
    .digest("hex");
}