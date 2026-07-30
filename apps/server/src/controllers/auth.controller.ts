import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import {
  countUsers,
  createUser,
  findByEmail,
  findById,
  setPasswordHash,
  setStatus,
} from "../models/mysql/users.js";
import {
  createResetToken,
  deleteTokensForUser,
  findValidToken,
} from "../models/mysql/passwordResets.js";
import { signToken } from "../utils/jwt.js";
import { sendMail } from "../utils/mailer.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export async function signup(req: Request, res: Response) {
  const { firstName, lastName, email, password } = req.body ?? {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const trimmedEmail = email.trim();
  const existing = await findByEmail(trimmedEmail);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const isFirstUser = (await countUsers()) === 0;

  const user = await createUser({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: trimmedEmail,
    passwordHash,
    role: isFirstUser ? "super_admin" : "user",
  });

  if (isFirstUser && user) {
    await setStatus(user.id, "active");
  }

  return res.status(201).json({
    data: isFirstUser
      ? { message: "Account created. You are the first user, so you were made super-admin and can sign in now." }
      : { message: "Account created. An admin needs to approve it before you can sign in." },
  });
}

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await findByEmail(email.trim());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (user.status === "pending") {
    return res.status(403).json({ error: "Your account is awaiting admin approval." });
  }
  if (user.status === "deactivated") {
    return res.status(403).json({ error: "Your account has been deactivated." });
  }

  const token = signToken({ userId: user.id, role: user.role });
  const { password_hash: _passwordHash, ...publicUser } = user;

  return res.json({ data: { token, user: publicUser } });
}

export async function me(req: Request, res: Response) {
  const user = await findById(req.user!.userId);
  return res.json({ data: user });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = await findByEmail(email.trim());

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await createResetToken(user.id, tokenHash, expiresAt);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password. It expires in 15 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }

  return res.json({ data: { message: "If that email is registered, a reset link has been sent." } });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body ?? {};
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetRecord = await findValidToken(tokenHash);
  if (!resetRecord) {
    return res.status(400).json({ error: "That reset link is invalid or has expired." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await setPasswordHash(resetRecord.user_id, passwordHash);
  await deleteTokensForUser(resetRecord.user_id);

  return res.json({ data: { message: "Password updated. You can now sign in." } });
}
