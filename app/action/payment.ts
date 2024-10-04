"use server";

import prisma from "../lib/prismaClient";
import { sendEmail } from "../lib/nodemailer";

import puppeteer from "puppeteer";

export const updatePayment = async (id: string, status: string) => {
  // Step 1: Update status pembayaran dulu
  const payment = await prisma.payment.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      project: {
        include: {
          user: true, // Ambil data user yang terkait dengan project
        },
      },
      company: true, // Asumsi relasi company juga sudah ada
    },
  });

  if (!payment) {
    throw new Error("Pembayaran tidak ditemukan.");
  }

  // Ambil user email dan user name dari relasi project -> user
  const userEmail = payment.project?.user?.email;
  const userName = payment.project?.user?.name;

  if (!userEmail || !userName) {
    throw new Error("Data pengguna tidak ditemukan.");
  }

  // Step 2: Render halaman /pdf/[id]/page.tsx jadi PDF di memory (tanpa simpan ke disk)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Misal aplikasi jalan di localhost:3000, kita render halaman PDF
  await page.goto(`http://localhost:3000/pdf/${id}`, {
    waitUntil: "networkidle0",
  });

  // Buat PDF dan simpan di memory (buffer)
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  // Step 3: Kirim PDF ke email user
  try {
    await sendEmail(
      userEmail, // Email user dari relasi project -> user
      `Invoice Pembayaran ${id}`,
      `Hi ${userName}, terlampir invoice untuk pembayaran dengan ID ${id}.`,
      [
        {
          filename: `invoice_${id}.pdf`,
          content: pdfBuffer, // Kirim buffer PDF langsung sebagai attachment
        },
      ]
    );
  } catch (error) {
    console.error("Gagal mengirim email:", error);
  }

  return payment;
};
export const createPayment = async (
  projectId: string,
  amount: string,
  status: string,
  dueDate: Date,
  companyId?: string
) => {
  // Step 1: Cari project beserta user yang terkait
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      user: true, // Ambil data user yang terkait dengan project
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Step 2: Buat pembayaran
  const payment = await prisma.payment.create({
    data: {
      projectId,
      amount,
      status,
      dueDate,
      companyId: companyId ?? "",
    },
  });

  // Step 3: Buat subject dan isi email
  const subject = `Invoice dengan nomor ${payment.id}`;
  const text = `
    Hi ${project.user.name},

    Pembayaran sebesar ${amount} untuk proyek ${
    project.name
  } telah berhasil dibuat.
    Status Pembayaran: ${status}
    Tanggal Jatuh Tempo: ${dueDate.toDateString()}

    
  `;

  try {
    // Step 4: Kirim email ke user
    await sendEmail(project.user.email, subject, text);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return payment;
};

export const getPayments = async (companyId?: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      companyId,
    },
    include: {
      project: {
        include: {
          user: true,
        },
      },
    },
  });

  // Filter pembayaran untuk hanya yang memiliki companyId
  return payments.filter((payment) => payment.companyId !== null);
};

export const getPaymentId = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      project: {
        include: {
          user: true,
        },
      },
    },
  });
  return payment;
};
