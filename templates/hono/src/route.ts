import { Hono } from "hono";
import { userRoutes } from "./domains/user/userRoutes";

export function buildRoutes(app: Hono) {
  app.route("/api/exams", userRoutes);
}
