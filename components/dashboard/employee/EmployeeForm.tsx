"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Role } from "@prisma/client";
import { createEmployeeWithCompany } from "@/app/action/employee";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/hooks/use-toast";

const EmployeeForm = ({
  session,
  companyId,
  onSubmitSuccess,
  onEmployeeAdded,
}: {
  session: any;
  companyId: string | null;
  onSubmitSuccess: () => void;
  onEmployeeAdded: (employee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role | null;
  }) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !selectedRole || !phone) {
      toast({
        title: "Error",
        description: "Harus diisi semua",
      });
      return;
    }
    if (session?.user?.role !== Role.OWNER) {
      toast({
        title: "Error",
        description: "Anda bukan Owner",
      });

      return;
    }

    if (!companyId) {
      toast({
        title: "Error",
        description: "Company ID cannot be null",
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Role cannot be null",
      });
    }

    try {
      const newEmployee = await createEmployeeWithCompany(
        name,
        email,
        password,
        phone,
        companyId,
        selectedRole as Role
      );
      setLoading(false);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      onSubmitSuccess();

      onEmployeeAdded(newEmployee);
    } catch (error) {
      toast({
        title: "Error",
        description: "Register failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            type="email"
            className="col-span-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="col-span-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Select onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Role)
                .filter((role) => role !== Role.OWNER)
                .map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
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
  );
};

export default EmployeeForm;
