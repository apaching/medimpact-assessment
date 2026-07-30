import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  findByEmail,
  findById,
  listUsers,
  setStatus,
  updateUser,
} from "../models/mysql/users.js";

export async function list(_req: Request, res: Response) {
  const users = await listUsers();
  return res.json({ data: users });
}

export async function getOne(req: Request, res: Response) {
  const user = await findById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ data: user });
}

export async function create(req: Request, res: Response) {
  const { firstName, lastName, email, password, role } = req.body ?? {};
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const trimmedEmail = email.trim();
  const existing = await findByEmail(trimmedEmail);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: trimmedEmail,
    passwordHash,
    role,
  });
  if (user) await setStatus(user.id, "active");

  return res.status(201).json({ data: await findById(user!.id) });
}

export async function update(req: Request, res: Response) {
  const { firstName, lastName, email, role } = req.body ?? {};
  if (!firstName || !lastName || !email || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const user = await updateUser(Number(req.params.id), {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    role,
  });
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ data: user });
}

export async function approve(req: Request, res: Response) {
  const user = await setStatus(Number(req.params.id), "active");
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ data: user });
}

export async function deactivate(req: Request, res: Response) {
  const user = await setStatus(Number(req.params.id), "deactivated");
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ data: user });
}

export async function remove(req: Request, res: Response) {
  await deleteUser(Number(req.params.id));
  return res.status(204).send();
}
