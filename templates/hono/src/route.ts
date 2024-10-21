import { Hono } from "hono";
import { examRoutes } from "./domains/user/userRoutes";

export function buildRoutes(app: Hono) {
  app.route("/api/exams", examRoutes);
}
