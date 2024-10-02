import { getClients } from "@/app/action/client";

import { auth } from "@/app/auth";
import prisma from "@/app/lib/prismaClient";
import ClientIndex from "@/components/dashboard/client/ClientIndex";
import React from "react";
export const revalidate = 300;

const Client = async () => {
  const session = await auth();
  const clients = await getClients();
  const userLogin = await prisma.employee.findUnique({
    where: {
      id: session?.user?.id as string,
    },
  });
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
