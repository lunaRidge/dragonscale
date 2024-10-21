import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return prisma.user.findMany();
  },

  getUserById: async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser: async (
    data: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> => {
    return prisma.user.create({ data });
  },

  updateUser: async (
    id: number,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  deleteUser: async (id: number): Promise<User> => {
    return prisma.user.delete({ where: { id } });
  },
};
