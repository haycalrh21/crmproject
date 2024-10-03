"use client";

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import EmployeEdit from "./EmployeEdit";
import EmployeDelete from "./EmployeDelete";
import { Skeleton } from "@/components/ui/skeleton";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role | null;
}

const EmployeeTable = ({
  fetchData,
  onEmployeeUpdated,
  onEmployeeDeleted,
}: {
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
  onEmployeeDeleted: (deletedEmployeeId: string) => void;
  fetchData: Employee[] | undefined;
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedEmployeeDelete, setSelectedEmployeeDelete] =
    useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (fetchData) {
      setLoading(false); // Only set loading to false when payment data exists
    } else {
      setLoading(true); // Keep loading if payment is null or undefined
    }
  }, [fetchData]);
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployeeDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      {loading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>. . .</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchData?.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.role}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>. . .</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(data)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(data)}>
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {selectedEmployee && (
        <EmployeEdit
          employee={selectedEmployee}
          isOpen={isEditDialogOpen}
          onEmployeeUpdated={onEmployeeUpdated}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
      {selectedEmployeeDelete && (
        <EmployeDelete
          employee={selectedEmployeeDelete}
          isOpen={isDeleteDialogOpen}
          onEmployeeDeleted={onEmployeeDeleted}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
