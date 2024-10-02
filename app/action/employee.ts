"use server";
import { sendEmail } from "../lib/nodemailer";

import { Role } from "@prisma/client";
import prisma from "../lib/prismaClient";
import bcrypt from "bcryptjs";

export const createEmployee = async (
  name: string,
  email: string,
  password: string,
  role: Role = Role.OWNER
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await prisma.employee.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
    },
  });

  return employee;
};

export const createEmployeeWithCompany = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  companyId: string,
  role: Role | null
) => {
  // Simpan password dalam hashed format untuk database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Membuat karyawan baru
  const employee = await prisma.employee.create({
    data: {
      name,
      email,
      password: hashedPassword, // Simpan password yang sudah di-hash
      phone,
      companyId,
      role,
    },
  });

  // Jika karyawan berhasil dibuat, kirim email
  if (employee) {
    const subject = "Welcome to the Company";
    const text = `Hello ${name},\n\nYour account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep your credentials safe.\n\nBest regards,\nCompany Team`;

    try {
      await sendEmail(email, subject, text);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return employee;
};

// Pastikan fungsi ini sudah benar
export const getEmployee = async (companyId: string) => {
  const employees = await prisma.employee.findMany({
    where: {
      companyId: companyId,
    },
  });
  return employees;
};

export const updateEmployee = async (
  id: string,
  name: string,
  email: string,
  phone: string,
  role: Role
) => {
  const employee = await prisma.employee.update({
    where: {
      id: id,
    },
    data: {
      name,
      email,
      phone,
      role,
    },
  });
  return employee;
};

export const deleteEmployee = async (id: string) => {
  const employee = await prisma.employee.delete({
    where: {
      id: id,
    },
  });
  return employee;
};
