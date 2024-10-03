import { getClients } from "@/app/action/client";
import { loginEmployee } from "@/app/action/employee";

import { auth } from "@/app/auth";
import ClientIndex from "@/components/dashboard/client/ClientIndex";
import React from "react";
export const revalidate = 300;

const Client = async () => {
  const session = await auth();
  const clients = await getClients();

  const userLogin = await loginEmployee(session?.user?.id as string);

  const cekClientCompany = clients.filter(
    (client) => client.companyId === userLogin?.companyId
  );

  return (
    <div>
      <ClientIndex session={userLogin} client={cekClientCompany} />
    </div>
  );
};

export default Client;
