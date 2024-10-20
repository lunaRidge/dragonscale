import { Hono } from "hono";
import { examHandlers } from "./examHandlers";

const examRoutes = new Hono();

examRoutes.get("/", examHandlers.getAllExams);
examRoutes.get("/:id", examHandlers.getExamById);
examRoutes.post("/", examHandlers.createExam);
examRoutes.put("/:id", examHandlers.updateExam);
examRoutes.delete("/:id", examHandlers.deleteExam);

export { examRoutes };
