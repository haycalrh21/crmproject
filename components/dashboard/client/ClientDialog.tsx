"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "./ClientForm";

const ClientDialog = ({
  session,
  onClientAdded,
}: {
  session: any;
  onClientAdded: (client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId?: string | null;
  }) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog open/close

  const handleDialogClose = () => setIsOpen(false); // Function to close the dialog
  console.table(session.role);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {(session?.role === "OWNER" || session?.role === "PROJECT_MANAGER") && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsOpen(true)}
          >
            Tambahkan Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambahkan Client</DialogTitle>
          <DialogDescription>Buat isi data Client</DialogDescription>
        </DialogHeader>
        <ClientForm
          session={session}
          onClientAdded={onClientAdded}
          onClose={handleDialogClose}
        />{" "}
        {/* Pass onClose prop */}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;
