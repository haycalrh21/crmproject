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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || !selectEmployee || !description || !selectedStatus) {
      console.error(
        "Project ID, Employee, Description, or Status cannot be null"
      );
      return;
    }
    if (
      session?.user?.role !== "PROJECT_MANAGER" &&
      session?.user?.role !== "OWNER"
    ) {
      alert("Anda bukan Karyawan");
      return;
    }
    const response = await assignTask(
      projectId,
      selectEmployee,
      description,
      selectedStatus,
      dueDate as Date
    );
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
              <Button type="submit" className="mt-4">
                Save changes
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
