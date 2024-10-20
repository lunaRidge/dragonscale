import { Hono } from "hono";
import { examRoutes } from "./domains/exam/examRoutes";

export function buildRoutes(app: Hono) {
  app.route("/api/exams", examRoutes);
}
