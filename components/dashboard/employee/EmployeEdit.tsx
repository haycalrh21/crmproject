import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { updateEmployee } from "@/app/action/employee";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const EmployeEdit = ({
  employee,
  isOpen,
  onClose,
  onEmployeeUpdated,
}: {
  employee: any;
  isOpen: boolean;
  onClose: () => void;
  onEmployeeUpdated: (updatedEmployee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }) => void;
}) => {
  const [name, setName] = useState(employee?.name || "");
  const [phone, setPhone] = useState(employee?.phone || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [selectRole, setSelectRole] = useState<Role | null>(
    employee?.role || null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateEmployee(
        employee.id,
        name,
        email,
        phone,
        selectRole ?? Role.EMPLOYEE
      );

      setLoading(false);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      onEmployeeUpdated(response);

      onClose(); // Close dialog after saving
    } catch (error) {
      setLoading(false);

      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    className="col-span-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="col-span-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    onValueChange={(value) => setSelectRole(value as Role)} // Casting to Role
                    value={selectRole || undefined} // Ensures the selected value is shown
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={selectRole || "Select a role"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Role.EMPLOYEE}>EMPLOYEE</SelectItem>
                      <SelectItem value={Role.PROJECT_MANAGER}>
                        PROJECT_MANAGER
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {loading ? (
                <Button type="submit">
                  <Spinner className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeEdit;
