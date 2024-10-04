import React from "react";
import CardProject from "./CardProject";
import { auth } from "@/app/auth";
import { getCompany } from "@/app/action/company";
import { getEmployee, loginEmployee } from "@/app/action/employee";
import { ProjectStatus } from "@prisma/client";
import { getClients } from "@/app/action/client";
import { getProjects } from "@/app/action/project";

export const revalidate = 300;

const ProjectIndex = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Session tidak valid.</div>;
  }

  const userLogin = await loginEmployee(session.user.id);

  if (!userLogin?.companyId) {
    return <div>User tidak terhubung dengan company.</div>;
  }

  const [getData, getEmployeeData, getClientData, projectData] =
    await Promise.all([
      getCompany({ id: userLogin.companyId }),
      getEmployee(userLogin.companyId),
      getClients(),
      getProjects(userLogin.companyId, 1, 8),
    ]);

  if (!getData) {
    return <div>Company tidak ditemukan.</div>;
  }

  const { projects, totalPages, currentPage } = projectData;

  // Map projects dan tentukan tipe untuk project
  const mappedProjects = projects.map((project) => ({
    ...project,
    endDate: project.endDate ?? new Date(), // Set default endDate jika null
    status: project.status ?? ProjectStatus.PENDING, // Set default status jika null
  }));

  // Map employee data to ensure role is always a string
  const mappedEmployeeData = getEmployeeData
    .map((employee) => ({
      id: employee.id,
      name: employee.name,
      role: employee.role || "No role assigned",
      // Pastikan companyId tidak null, gunakan nilai default atau filter
      companyId: employee.companyId ?? "", // Ganti dengan string kosong jika null
    }))
    .filter((employee) => employee.companyId); // Hapus employee tanpa companyId

  return (
    <div className="p-4" suppressHydrationWarning={true}>
      <CardProject
        session={session}
        client={getClientData}
        employee={mappedEmployeeData}
        project={mappedProjects} // pastikan project juga dikirim jika diperlukan
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProjectIndex;
