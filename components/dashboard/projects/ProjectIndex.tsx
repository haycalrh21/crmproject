import React from "react";
import CardProject from "./CardProject";
import { auth } from "@/app/auth";
import { getCompany } from "@/app/action/company";
import { getEmployee } from "@/app/action/employee";
import { ProjectStatus } from "@prisma/client"; // Pastikan import ProjectStatus benar
import { getClients } from "@/app/action/client";
import { getProjects } from "@/app/action/project";
import prisma from "@/app/lib/prismaClient";

export const revalidate = 300; // Revalidate every 60 seconds, or use cache 'no-store' for no cache

interface Employee {
  id: string;
  companyId: string | null; // Pastikan companyId bisa null
}

const ProjectIndex = async () => {
  const session = await auth();

  // Cari employee berdasarkan user yang sedang login
  const userLogin = (await prisma.employee.findUnique({
    where: {
      id: session?.user?.id as string,
    },
  })) as Employee;

  // Validasi userLogin dan companyId
  if (!userLogin || !userLogin.companyId) {
    throw new Error("User not found.");
  }

  // Ambil data perusahaan berdasarkan companyId dari employee yang login
  const getData = await getCompany({
    id: userLogin.companyId as string, // Kirim objek dengan id
  });

  // Pastikan getData ada sebelum melanjutkan
  if (!getData) {
    throw new Error("Company not found.");
  }

  const getEmployeeData = await getEmployee(getData.id); // Ambil karyawan berdasarkan id perusahaan
  const getClientData = await getClients();

  // Ambil data proyek berdasarkan companyId dan pagination
  const { projects, totalPages, currentPage } = await getProjects(
    userLogin.companyId,
    1,
    8
  );

  // Map projects dan tentukan tipe untuk project
  const mappedProjects = projects.map((project) => ({
    ...project,
    endDate: project.endDate ?? new Date(),
    // Ensure that the status is never null, provide a default if it is
    status: project.status ?? ProjectStatus.PENDING, // Replace PENDING with an appropriate default status
  }));

  // Map employee data to ensure role is always a string
  const mappedEmployeeData = getEmployeeData.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: employee.role || "No role assigned", // Default value if role is null
  }));

  return (
    <div className="p-4">
      <CardProject
        session={session}
        client={getClientData}
        employee={mappedEmployeeData}
        project={mappedProjects} // Kirim data proyek yang sudah dimodifikasi
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProjectIndex;
