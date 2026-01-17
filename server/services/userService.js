// server/services/userService.js
import { User } from "#models/user.js";

/**
 * Basic phone normalization — tweak if you need international rules.
 */
export function normalizePhone(phone) {
  if (!phone) return phone;
  let s = String(phone).trim();
  // Strip +91 or just + so we match the "raw" number in DB
  if (s.startsWith("+91")) s = s.slice(3);
  else if (s.startsWith("+")) s = s.slice(1);
  return s;
}

/**
 * Find user by phoneNumber
 */
export async function findUserByPhone(phoneNumber) {
  const phone = normalizePhone(phoneNumber);
  return User.findOne({ phoneNumber: phone }).select("-__v");
}

/**
 * Add or update a whitelisted user.
 *
 * Logic:
 * 1) If a user with the same phoneNumber exists => update username/isAllowed and return it.
 * 2) If not, ensure username isn't already taken by another phone. If taken => throw a 409-style error.
 * 3) Otherwise create the user with isAllowed=true.
 *
 * Throws Error with { code: 'USERNAME_TAKEN', existingUser } if username conflict occurs.
 */
export async function addWhitelistedUser(username, phoneNumber) {
  const phone = normalizePhone(phoneNumber);
  const name = String(username).trim();

  if (!name || !phone) {
    throw new Error("username and phoneNumber are required");
  }

  // 1) existing by phone?
  let user = await User.findOne({ phoneNumber: phone });
  if (user) {
    user.username = name;
    user.isAllowed = true;
    await user.save();
    return user;
  }

  // 2) username collision check (username unique index causing previous failure)
  const existingByUsername = await User.findOne({ username: name });
  if (existingByUsername) {
    // If the existing username belongs to the same phone (shouldn't happen because we checked), allow it.
    if (existingByUsername.phoneNumber !== phone) {
      const err = new Error("Username already taken by another user");
      err.code = "USERNAME_TAKEN";
      err.existingUser = existingByUsername;
      throw err;
    }
    // else fallthrough to update (not likely because phone lookup returned null)
  }

  // 3) safe to create
  user = new User({
    username: name,
    phoneNumber: phone,
    isAllowed: true,
  });

  await user.save();
  return user;
}
