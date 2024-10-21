import { Hono } from "hono";
import { userHandlers } from "./userHandlers";

const userRoutes = new Hono();

userRoutes.get("/", userHandlers.getAllUsers);
userRoutes.get("/:id", userHandlers.getUserById);
userRoutes.post("/", userHandlers.createUser);
userRoutes.put("/:id", userHandlers.updateUser);
userRoutes.delete("/:id", userHandlers.deleteUser);

export { userRoutes };
