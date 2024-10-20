import { Context } from "hono";
import { examService } from "./examService";

export const examHandlers = {
  getAllExams: async (c: Context) => {
    try {
      const exams = await examService.getAllExams();
      return c.json(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  getExamById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const exam = await examService.getExamById(id);
      if (!exam) {
        return c.json({ error: "Exam not found" }, 404);
      }
      return c.json(exam);
    } catch (error) {
      console.error(`Error fetching exam with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  createExam: async (c: Context) => {
    try {
      const data = await c.req.json();
      const exam = await examService.createExam(data);
      return c.json(exam, 201);
    } catch (error) {
      console.error("Error creating exam:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  updateExam: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const data = await c.req.json();
      const exam = await examService.updateExam(id, data);
      return c.json(exam);
    } catch (error) {
      console.error(`Error updating exam with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },

  deleteExam: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      await examService.deleteExam(id);
      return c.json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error(`Error deleting exam with id ${id}:`, error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },
};
