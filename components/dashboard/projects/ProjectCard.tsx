import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectStatus } from "@prisma/client";
import TaskDialog from "../task/TaskDialog";
import ProjectEditDialog from "./ProjectEditDialog";
import { Project } from "@/app/types/project";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCard = ({
  session,
  employee,
  project,
  onStatusUpdate, // Add this line
}: {
  session: any;
  employee: { id: string; name: string; role: string }[];
  project: {
    id: string;
    name: string;
    description: string;
    user: { id: string; name: string };
    employee: { id: string; name: string };
    startDate: Date;
    endDate: Date | null;
    status: ProjectStatus;
  };
  onStatusUpdate: (updatedProject: Project) => void;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      setLoading(false); // Only set loading to false when payment data exists
    } else {
      setLoading(true); // Keep loading if payment is null or undefined
    }
  }, [project]);
  const formatDate = (date: Date | null) => {
    if (!date) return ""; // Handle null dates
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div suppressHydrationWarning={true}>
      <div suppressHydrationWarning={true}>
        {loading ? (
          <Card className="p-4 flex flex-col items-start justify-between border rounded-md shadow-lg w-full max-w-sm mx-auto bg-white">
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
            <Skeleton className="w-[100px] h-[20px] mt-2 rounded-full" />
          </Card>
        ) : (
          <Card className="p-4 flex flex-col items-start justify-between border rounded-md shadow-lg w-full max-w-sm mx-auto bg-white">
            <CardHeader className="flex flex-col w-full mb-4" key={project.id}>
              <CardTitle className="text-lg font-semibold">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-700">
                {project.description}
              </CardDescription>
              <div className="mt-2 text-sm text-gray-600">
                <div className="font-medium">Client: {project.user.name}</div>
                <div className="font-medium">
                  Employee: {project.employee.name}
                </div>
                <div className="font-medium">Status: {project.status}</div>
                <div suppressHydrationWarning>
                  Start: {formatDate(project.startDate)} - End:{" "}
                  {formatDate(project.endDate)}
                </div>
              </div>
            </CardHeader>
            <div className="flex justify-center items-center w-full space-x-4">
              {(session.user.role === "OWNER" ||
                session.user.role === "PROJECT_MANAGER") && (
                <div
                  className="flex items-center space-x-4"
                  suppressHydrationWarning={true}
                >
                  <ProjectEditDialog
                    project={project}
                    session={session}
                    onStatusUpdate={onStatusUpdate}
                  />
                  <TaskDialog
                    project={project}
                    employee={employee}
                    session={session}
                  />
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
