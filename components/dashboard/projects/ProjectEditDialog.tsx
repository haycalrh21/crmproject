"use client";
import { projectComplete, updateProjectStatus } from "@/app/action/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectStatus } from "@prisma/client";
import { useState } from "react";
import { Project } from "@/app/types/project";

const ProjectEditDialog = ({
  project,
  session,
  onStatusUpdate,
}: {
  project: any;
  session: any;
  onStatusUpdate: (updatedProject: Project) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const statusproject = [
    {
      id: 1,
      name: "IN_PROGRESS",
    },
    {
      id: 2,
      name: "COMPLETED",
    },
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      console.error("Status cannot be null");
      return;
    }
    if (
      session?.user?.role !== "PROJECT_MANAGER" &&
      session?.user?.role !== "OWNER"
    ) {
      alert("Anda bukan Karyawan");
      return;
    }

    const isProjectComplete = await projectComplete(project.id);
    console.log(isProjectComplete);
    if (!isProjectComplete) {
      alert("Project belum kelar, silahkan selesaikan tugas terlebih dahulu");
      return;
    } else {
      await updateProjectStatus(project.id, selectedStatus as ProjectStatus);

      // Call the onStatusUpdate callback with the updated project
      onStatusUpdate({ ...project, status: selectedStatus as ProjectStatus });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="edit" className="flex-1 text-xs">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Select Status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusproject.map((status) => (
                        <SelectItem key={status.id} value={status.name}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" type="submit">
                  Submit
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectEditDialog;
