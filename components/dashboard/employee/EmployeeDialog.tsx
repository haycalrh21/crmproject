import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Role } from "@prisma/client";
import EmployeeForm from "./EmployeeForm";

const EmployeeDialog = ({
  session,
  data,
  onSubmitSuccess,
  onEmployeeAdded,
}: {
  session: any;
  data: { id: string } | null;
  onSubmitSuccess: () => void; // Add this prop
  onEmployeeAdded: (employee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }) => void; // Add this prop
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    onSubmitSuccess(); // Call the success handler when the dialog is closed
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {session?.user?.role !== Role.OWNER ? (
          <Button variant="outline" disabled className="mt-4">
            Lihat Karyawan
          </Button>
        ) : (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsDialogOpen(true)}
          >
            Tambahkan Karyawan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambahkan Karyawan</DialogTitle>
          <DialogDescription>Buat isi data karyawan</DialogDescription>
        </DialogHeader>
        <EmployeeForm
          session={session}
          companyId={data?.id ?? null}
          onSubmitSuccess={handleDialogClose}
          onEmployeeAdded={onEmployeeAdded} // Pass the handler to EmployeeForm
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
