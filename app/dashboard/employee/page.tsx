import { getCompany } from "@/app/action/company";
import { getEmployee } from "@/app/action/employee";
import { auth } from "@/app/auth";
import prisma from "@/app/lib/prismaClient";
import EmployeeIndex from "@/components/dashboard/employee/EmployeeIndex";

import { Role } from "@prisma/client";
export const revalidate = 300;

const EmployePages = async () => {
  const session = await auth();

  const getData = await prisma.employee.findUnique({
    where: {
      id: session?.user?.id as string,
    },
  });

  const companyId = getData?.companyId; // Pastikan companyData memiliki field id

  const fetchData = companyId ? await getEmployee(companyId) : [];

  return (
    <div>
      <EmployeeIndex
        session={session}
        data={getData}
        initialFetchData={fetchData}
      />
    </div>
  );
};

export default EmployePages;
