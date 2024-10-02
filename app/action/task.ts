"use server";

import prisma from "../lib/prismaClient";

export const assignTask = async (
  projectId: string,
  employeeId: string,
  description: string,
  status: string,
  dueDate: Date
) => {
  const response = await prisma.task.create({
    data: {
      projectId,
      employeeId,
      description,
      status,
      dueDate,
    },
  });
  return response;
};

export const taskEmployee = async (companyId: string) => {
  const response = await prisma.employee.findMany({
    where: {
      companyId,
    },
    include: {
      tasks: true,
    },
  });
  return response;
};

export const updateTask = async (
  id: string,

  status: "Sudah Selesai"
) => {
  const response = await prisma.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return response;
};
