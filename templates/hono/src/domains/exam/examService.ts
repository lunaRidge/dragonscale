import { PrismaClient, Exam } from "@prisma/client";

const prisma = new PrismaClient();

export const examService = {
  getAllExams: async (): Promise<Exam[]> => {
    return prisma.exam.findMany();
  },

  getExamById: async (id: number): Promise<Exam | null> => {
    return prisma.exam.findUnique({ where: { id } });
  },

  createExam: async (
    data: Omit<Exam, "id" | "createdAt" | "updatedAt">
  ): Promise<Exam> => {
    return prisma.exam.create({ data });
  },

  updateExam: async (
    id: number,
    data: Partial<Omit<Exam, "id" | "createdAt" | "updatedAt">>
  ): Promise<Exam> => {
    return prisma.exam.update({
      where: { id },
      data,
    });
  },

  deleteExam: async (id: number): Promise<Exam> => {
    return prisma.exam.delete({ where: { id } });
  },
};
