"use server";

import prisma from "../lib/prismaClient";
import cloudinary from "cloudinary";
import { Role } from "@prisma/client";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadImage = async (base64Image: any) => {
  try {
    const result = await cloudinary.v2.uploader.upload(base64Image, {
      folder: process.env.CLOUDINARY_FOLDER,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

export async function createCompany({
  name,
  address,
  phone,
  logo,
  employeeId,
}: {
  name: string;
  address: string;
  phone: string;
  logo: string; // Pastikan ini adalah string
  employeeId: string;
}) {
  // Buat perusahaan di database
  const company = await prisma.company.create({
    data: {
      name,
      address,
      phone,
      logo, // Menggunakan URL gambar yang diupload
    },
  });

  // Update employee dengan companyId
  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      companyId: company.id,
    },
  });

  return company;
}

export async function getCompany({ id }: { id: string }) {
  const company = await prisma.company.findFirst({
    where: {
      employees: {
        some: {
          // Ensure there's an employee with the given ID and role
          companyId: id,
        },
      },
    },
  });

  return company; // Return the found company
}

const base64ToBuffer = (base64Image: any) => {
  const matches = base64Image.match(/^data:.+\/(.+);base64,(.+)$/);
  const data = matches[2];
  return Buffer.from(data, "base64");
};
