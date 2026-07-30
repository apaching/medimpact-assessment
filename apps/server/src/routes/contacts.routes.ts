import { Router } from "express";
import * as contacts from "../controllers/contacts.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireActiveUser } from "../middleware/activeUser.js";
import { upload } from "../middleware/upload.js";

export const contactsRouter = Router();

contactsRouter.use(requireAuth, requireActiveUser);

contactsRouter.get("/", contacts.list);
contactsRouter.get("/:id", contacts.getOne);
contactsRouter.post("/", upload.single("photo"), contacts.create);
contactsRouter.put("/:id", upload.single("photo"), contacts.update);
contactsRouter.delete("/:id", contacts.remove);

contactsRouter.get("/:id/shares", contacts.listShares);
contactsRouter.post("/:id/share", contacts.share);
contactsRouter.delete("/:id/share/:userId", contacts.unshare);
