"use server";

import prisma from "../lib/prismaClient";

interface Client {
  name: string;
  email: string;
  phone: string;
  companyId?: string;
}
export const createClient = async (
  name: string,
  email: string,
  phone: string,
  companyId?: string // Pastikan ini optional jika ingin
) => {
  const client = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      companyId, // Ini harus diterima setelah perbaruan tipe
    },
  });
  return client;
};

export const getClients = async () => {
  const clients = await prisma.user.findMany();
  return clients;
};

export const deleteClient = async (id: string) => {
  const client = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return client;
};
