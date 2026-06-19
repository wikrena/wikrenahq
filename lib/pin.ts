import { createHash } from "crypto"

/**
 * PIN hashing utilities.
 *
 * We use a simple but secure approach:
 * SHA-256(PIN + USER_ID) as the stored hash.
 *
 * The user ID acts as a salt — unique per child.
 * This means even if two children have the same PIN,
 * their hashes are different.
 *
 * Note: For a PIN (4–6 digits), this is appropriate.
 * For passwords we use Supabase Auth which handles hashing properly.
 */

export function hashPin(pin: string, userId: string): string {
  return createHash("sha256")
    .update(`${pin}:${userId}:${process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-8) ?? "wk"}`)
    .digest("hex")
}

export function verifyPin(pin: string, userId: string, storedHash: string): boolean {
  return hashPin(pin, userId) === storedHash
}

/**
 * Migration helper — check if a stored value is already hashed
 * (hashes are 64 hex chars, PINs are 4–6 digits)
 */
export function isHashed(value: string): boolean {
  return /^[0-9a-f]{64}$/.test(value)
}
