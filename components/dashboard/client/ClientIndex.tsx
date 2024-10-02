"use client";

import { useState } from "react";
import ClientDialog from "./ClientDialog";
import ClientTable from "./ClientTable";

const ClientIndex = ({
  session,
  client,
}: {
  session: any;
  client: { id: string; name: string; email: string; phone: string }[];
}) => {
  const [clients, setClients] = useState(client);

  const handleClientAdded = (newClient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId?: string | null;
  }) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleDeleted = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  return (
    <div>
      <ClientDialog session={session} onClientAdded={handleClientAdded} />
      <ClientTable clients={clients} handleDeleted={handleDeleted} />
    </div>
  );
};

export default ClientIndex;
