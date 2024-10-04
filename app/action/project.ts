"use server";

import prisma from "../lib/prismaClient";
import { sendEmail } from "../lib/nodemailer";
import { Employee } from "../types/employee";
import { ProjectStatus, User } from "@prisma/client";

export const createProject = async (
  name: string,
  description: string,
  userId: string,
  employeeId: string,
  companyId: string, // Pastikan companyId ditambahkan di parameter
  startDate: Date,
  endDate: Date | null,
  status: ProjectStatus,
  paymentAmount: string,
  paymentStatus: string,
  paymentDueDate: Date
) => {
  const employee: Employee | null = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  const project = await prisma.project.create({
    data: {
      name,
      description,
      userId,
      employeeId,
      startDate,
      endDate,
      status,
      payments: {
        create: {
          amount: paymentAmount,
          status: paymentStatus,
          dueDate: paymentDueDate,
          companyId, // Tambahkan companyId di sini
        },
      },
    },
  });
  if (project && employee) {
    const subjectEmployee = "Proyek Baru Diciptakan";
    const textEmployee = `
      Hai ${employee.name},

      Kami ingin memberi tahu Anda bahwa proyek baru telah diciptakan:

      Nama Proyek: ${project.name}
      Deskripsi: ${project.description}
      Tanggal Mulai: ${startDate.toDateString()}
      Tanggal Selesai: ${endDate ? endDate.toDateString() : "Belum ditentukan"}
      Jumlah Pembayaran: ${paymentAmount}
      Status Pembayaran: ${paymentStatus}
      Tanggal Jatuh Tempo: ${paymentDueDate.toDateString()}

      Terima kasih,
      Tim Kami
    `;

    try {
      await sendEmail(employee.email, subjectEmployee, textEmployee);
    } catch (error) {
      console.error("Error sending email to employee:", error);
    }

    // Kirim email ke pengguna
    const user: User | null = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      const subjectUser = "Proyek Baru Diciptakan untuk Anda";
      const textUser = `
        Hai ${user.name},

        Proyek baru telah diciptakan untuk Anda:

        Nama Proyek: ${project.name}
        Deskripsi: ${project.description}
        Tanggal Mulai: ${startDate.toDateString()}
        Tanggal Selesai: ${
          endDate ? endDate.toDateString() : "Belum ditentukan"
        }
        Jumlah Pembayaran: ${paymentAmount}
        Status Pembayaran: ${paymentStatus}
        Tanggal Jatuh Tempo: ${paymentDueDate.toDateString()}

        Terima kasih,
        Tim Kami
      `;

      try {
        await sendEmail(user.email, subjectUser, textUser);
      } catch (error) {
        console.error("Error sending email to user:", error);
      }
    }
  }

  return project;
};

export const getProjects = async (
  companyId: string,
  page = 1,
  pageSize = 8
) => {
  const projects = await prisma.project.findMany({
    where: {
      employee: {
        companyId: companyId, // Filter proyek berdasarkan companyId dari employee
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      user: true,
      employee: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalProjects = await prisma.project.count({
    where: {
      employee: {
        companyId: companyId,
      },
    },
  });

  return {
    projects,
    totalPages: Math.ceil(totalProjects / pageSize), // Menghitung total halaman
    currentPage: page, // Halaman saat ini
  };
};

export const getProjectPayment = async () => {
  const project = await prisma.project.findMany({
    include: {
      user: true,
    },
  });
  return project;
};

export const projectComplete = async (projectId: string) => {
  const completedTasks = await prisma.task.findMany({
    where: {
      projectId, // Memfilter tugas berdasarkan projectId
      status: "Sudah Selesai", // Memastikan status tugas adalah "Sudah Selesai"
    },
  });

  // Memeriksa apakah jumlah tugas yang telah selesai sama dengan jumlah total tugas di proyek
  const totalTasks = await prisma.task.count({
    where: {
      projectId, // Memfilter berdasarkan projectId
    },
  });

  return completedTasks.length === totalTasks;
};

export const updateProjectStatus = async (
  projectId: string,
  status: ProjectStatus
) => {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { status }, // Menyimpan status baru
  });
  return updatedProject;
};
