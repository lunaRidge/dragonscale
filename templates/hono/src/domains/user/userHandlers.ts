import { Context } from "hono";
import { userService } from "./userService";

export const userHandlers = {
  getAllUsers: async (c: Context) => {
    try {
      const users = await userService.getAllUsers();
      return c.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  getUserById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const user = await userService.getUserById(id);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json(user);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  createUser: async (c: Context) => {
    try {
      const data = await c.req.json();
      const user = await userService.createUser(data);
      return c.json(user, 201);
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  updateUser: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const data = await c.req.json();
      const user = await userService.updateUser(id, data);
      return c.json(user);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  deleteUser: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      await userService.deleteUser(id);
      return c.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },
};
