"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // Pastikan Calendar diimpor
import { assignTask } from "@/app/action/task";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const TaskDialog = ({
  session,
  project,
  employee,
}: {
  session: any;
  project: any;
  employee: { id: string; name: string; role: string }[];
}) => {
  const [projectId, setProjectId] = useState<string | null>(project.id);
  const [selectEmployee, setSelectEmployee] = useState<string | null>(
    project.employee.id
  );
  const [description, setDescription] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!projectId || !selectEmployee || !description || !selectedStatus) {
        toast({
          title: "Error",
          description: "Harus diisi semua",
        });
        return;
      }
      if (
        session?.user?.role !== "PROJECT_MANAGER" &&
        session?.user?.role !== "OWNER"
      ) {
        toast({
          title: "Error",
          description: "Anda bukan Owner/Project Manager",
        });
        return;
      }
      const response = await assignTask(
        projectId,
        selectEmployee,
        description,
        selectedStatus,
        dueDate as Date
      );
      setLoading(false);
      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to assign task",
      });
    }
  };
  const filteredEmployees = employee.filter((emp) => emp.role === "EMPLOYEE");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 text-xs">
          Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Project ID and Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectId" className="text-right">
                    Id Project - Nama Project
                  </Label>
                  <Input
                    id="projectId"
                    className="col-span-3 border rounded-md"
                    value={`${project.id} - ${project.name}`}
                    readOnly
                  />
                </div>

                {/* Employee Role */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="selectEmployee" className="text-right">
                    Employee
                  </Label>
                  <Select onValueChange={(value) => setSelectEmployee(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    className="col-span-3 border rounded-md"
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Status */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Selesai">
                        Belum Selesai
                      </SelectItem>
                      <SelectItem value="Sudah Selesai">
                        Sudah Selesai
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    className="col-span-3 border rounded-md"
                  />
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

export default TaskDialog;
