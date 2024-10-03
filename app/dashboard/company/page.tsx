import { getCompany } from "@/app/action/company";
import { loginEmployee } from "@/app/action/employee";
import { auth } from "@/app/auth";
import CompanyIndex from "@/components/dashboard/company/CompanyIndex";

export const revalidate = 300;
const CompanyPage = async () => {
  const session = await auth();
  const userLogin = await loginEmployee(session?.user?.id as string);

  const getData = await getCompany({
    id: userLogin?.companyId as string,
  });

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-h-[80vh] overflow-y-auto border rounded-lg shadow-md">
        <CompanyIndex session={session} data={getData} />
      </div>
    </div>
  );
};

export default CompanyPage;
