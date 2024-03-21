import crypto from "crypto";

export function getRandomString(size: number) {
  return crypto.randomBytes(size).toString("hex");
}
