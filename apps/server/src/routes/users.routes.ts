import { Router } from "express";
import * as users from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireActiveUser } from "../middleware/activeUser.js";
import { requireRole } from "../middleware/role.js";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireActiveUser, requireRole("admin", "super_admin"));

usersRouter.get("/", users.list);
usersRouter.post("/", users.create);
usersRouter.get("/:id", users.getOne);
usersRouter.put("/:id", users.update);
usersRouter.post("/:id/approve", users.approve);
usersRouter.post("/:id/deactivate", users.deactivate);
usersRouter.delete("/:id", users.remove);
