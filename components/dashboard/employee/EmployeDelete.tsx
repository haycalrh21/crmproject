import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Employee, Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteEmployee } from "@/app/action/employee";

const EmployeDelete = ({
  employee,
  isOpen,
  onClose,
  onEmployeeDeleted,
}: {
  employee: {
    id: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onEmployeeDeleted: (deletedEmployeeId: string) => void;
}) => {
  const handleDelete = async () => {
    const employeeId = employee.id;

    const response = await deleteEmployee(employeeId);
    onEmployeeDeleted(employeeId);

    onClose();
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this file from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeDelete;
