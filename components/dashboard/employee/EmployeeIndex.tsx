"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import { Role } from "@prisma/client";

const EmployeeIndex = ({
  session,
  data,
  initialFetchData,
}: {
  session: any;
  data: { id: string; companyId: string | null } | null; // Perbaikan di sini
  initialFetchData: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchData, setFetchData] = useState(initialFetchData);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEmployeeAdded = (newEmployee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }) => {
    setFetchData((prevData) => [...prevData, newEmployee]);
  };

  const handleEmployeeUpdated = (updatedEmployee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }) => {
    setFetchData((prevData) =>
      prevData.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  };

  const handleEmployeeDeleted = (deletedEmployeeId: string) => {
    setFetchData((prevData) =>
      prevData.filter((employee) => employee.id !== deletedEmployeeId)
    );
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {(session?.user?.role === Role.OWNER ||
            session?.user?.role === Role.PROJECT_MANAGER) && (
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
          </DialogHeader>
          <EmployeeForm
            session={session}
            companyId={data?.companyId ?? null} // Pastikan mengambil companyId yang benar
            onSubmitSuccess={handleDialogClose}
            onEmployeeAdded={handleEmployeeAdded}
          />
        </DialogContent>
      </Dialog>
      <div>
        <EmployeeTable
          fetchData={fetchData}
          onEmployeeUpdated={handleEmployeeUpdated}
          onEmployeeDeleted={handleEmployeeDeleted}
        />
      </div>
    </div>
  );
};

export default EmployeeIndex;
