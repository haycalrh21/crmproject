import { getEmployee, loginEmployee } from "@/app/action/employee";
import { auth } from "@/app/auth";

import EmployeeIndex from "@/components/dashboard/employee/EmployeeIndex";

export const revalidate = 300;

const EmployePages = async () => {
  const session = await auth();

  const userLogin = await loginEmployee(session?.user?.id as string);

  const companyId = userLogin?.companyId;

  const fetchData = companyId ? await getEmployee(companyId) : [];

  return (
    <div>
      <EmployeeIndex
        session={session}
        data={userLogin}
        initialFetchData={fetchData}
      />
    </div>
  );
};

export default EmployePages;
