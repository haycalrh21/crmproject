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
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    try {
      e.preventDefault();
      setLoading(true);
      if (!selectedStatus) {
        toast({
          title: "Error",
          description: "Please select a status",
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

      const isProjectComplete = await projectComplete(project.id);

      if (!isProjectComplete) {
        toast({
          title: "Error",
          description: "Project must be completed before updating status",
        });
        return;
      } else {
        await updateProjectStatus(project.id, selectedStatus as ProjectStatus);
        setLoading(false);
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
        onStatusUpdate({ ...project, status: selectedStatus as ProjectStatus });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div suppressHydrationWarning={true}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="edit" className="flex-1 text-xs">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle suppressHydrationWarning={true}>
              Edit Status
            </DialogTitle>
            <DialogDescription suppressHydrationWarning={true}>
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
                {loading ? (
                  <Button type="submit" suppressHydrationWarning={true}>
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
    </div>
  );
};

export default ProjectEditDialog;
