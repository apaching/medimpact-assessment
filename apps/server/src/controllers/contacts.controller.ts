import type { Request, Response } from "express";
import type { ContactDoc } from "../models/mongo/Contact.js";
import { Contact } from "../models/mongo/Contact.js";
import {
  deleteSharesForContact,
  isSharedWithUser,
  listContactIdsSharedWithUser,
  listSharedUserIds,
  shareContact,
  unshareContact,
} from "../models/mysql/sharedContacts.js";
import { findByEmail, findById as findUserById } from "../models/mysql/users.js";
import { deletePhoto, getPhotoUrl, uploadPhoto } from "../utils/storage.js";

async function canView(contactId: string, userId: number, ownerId: number) {
  if (ownerId === userId) return true;
  return isSharedWithUser(contactId, userId);
}

async function withPhotoUrl(contact: ContactDoc) {
  return { ...contact.toObject(), photo: await getPhotoUrl(contact.photo) };
}

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;
  const sharedContactIds = await listContactIdsSharedWithUser(userId);

  const contacts = await Contact.find({
    $or: [{ ownerId: userId }, { _id: { $in: sharedContactIds } }],
  }).sort({ createdAt: -1 });

  return res.json({ data: await Promise.all(contacts.map(withPhotoUrl)) });
}

export async function getOne(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });

  const allowed = await canView(contact.id, req.user!.userId, contact.ownerId);
  if (!allowed) return res.status(403).json({ error: "You don't have access to this contact." });

  return res.json({ data: await withPhotoUrl(contact) });
}

export async function create(req: Request, res: Response) {
  const { firstName, lastName, contactNumber, email } = req.body ?? {};
  if (!firstName || !lastName || !contactNumber) {
    return res.status(400).json({ error: "First name, last name, and contact number are required." });
  }

  const photoKey = req.file ? await uploadPhoto(req.file) : null;

  const contact = await Contact.create({
    ownerId: req.user!.userId,
    firstName,
    lastName,
    contactNumber,
    email,
    photo: photoKey,
  });

  return res.status(201).json({ data: await withPhotoUrl(contact) });
}

export async function update(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });

  if (contact.ownerId !== req.user!.userId) {
    return res.status(403).json({ error: "Only the owner can edit this contact." });
  }

  const { firstName, lastName, contactNumber, email } = req.body ?? {};
  contact.firstName = firstName ?? contact.firstName;
  contact.lastName = lastName ?? contact.lastName;
  contact.contactNumber = contactNumber ?? contact.contactNumber;
  contact.email = email ?? contact.email;

  if (req.file) {
    await deletePhoto(contact.photo);
    contact.photo = await uploadPhoto(req.file);
  }

  await contact.save();
  return res.json({ data: await withPhotoUrl(contact) });
}

export async function remove(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });

  if (contact.ownerId !== req.user!.userId) {
    return res.status(403).json({ error: "Only the owner can delete this contact." });
  }

  await deletePhoto(contact.photo);
  await contact.deleteOne();
  await deleteSharesForContact(contact.id);
  return res.status(204).send();
}

export async function share(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });
  if (contact.ownerId !== req.user!.userId) {
    return res.status(403).json({ error: "Only the owner can share this contact." });
  }

  const { email } = req.body ?? {};
  const targetUser = email ? await findByEmail(email.trim()) : null;
  if (!targetUser) return res.status(404).json({ error: "No user found with that email." });
  if (targetUser.id === contact.ownerId) {
    return res.status(400).json({ error: "The contact is already owned by that user." });
  }

  await shareContact(contact.id, contact.ownerId, targetUser.id);
  return res.status(201).json({ data: { message: `Shared with ${targetUser.email}.` } });
}

export async function unshare(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });
  if (contact.ownerId !== req.user!.userId) {
    return res.status(403).json({ error: "Only the owner can unshare this contact." });
  }

  await unshareContact(contact.id, Number(req.params.userId));
  return res.status(204).send();
}

export async function listShares(req: Request, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Contact not found." });
  if (contact.ownerId !== req.user!.userId) {
    return res.status(403).json({ error: "Only the owner can view this contact's shares." });
  }

  const userIds = await listSharedUserIds(contact.id);
  const sharedUsers = await Promise.all(userIds.map((id) => findUserById(id)));
  return res.json({ data: sharedUsers.filter(Boolean) });
}
