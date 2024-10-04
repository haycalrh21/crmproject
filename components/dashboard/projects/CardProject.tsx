"use client";

import { useState } from "react";
import { DialogComponent } from "./DialogComponent";
import { ProjectCard } from "./ProjectCard";
import { getProjects } from "@/app/action/project";
import { Button } from "@/components/ui/button";
import { ProjectStatus } from "@prisma/client";

interface Project {
  id: string;
  name: string;
  description: string;
  user: { id: string; name: string };
  employee: { id: string; name: string };
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
}

const CardProject = ({
  session,
  client,
  employee,
  project,
  totalPages,
  currentPage: initialCurrentPage,
}: {
  session: any;
  project: Project[];
  employee: { id: string; name: string; role: string; companyId: string }[];
  client: { id: string; name: string }[];
  totalPages: number;
  currentPage: number;
}) => {
  const [projects, setProjects] = useState<Project[]>(project);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  const updateProjects = async (newPage: number) => {
    const { projects: newProjects } = await getProjects(String(newPage), 8);
    const transformedProjects = newProjects.map((project) => ({
      ...project,
      status: project.status as ProjectStatus,
    }));
    setProjects(transformedProjects);
  };

  // Callback function to update project status
  const handleProjectStatusUpdate = async (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
  };

  return (
    <div
      className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 items-center justify-center"
      suppressHydrationWarning={true}
    >
      <DialogComponent
        session={session}
        client={client}
        employee={employee}
        setProjects={setProjects}
        resetForm={() => {}}
      />
      <div className="col-span-1 lg:col-span-4" suppressHydrationWarning={true}>
        <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.length === 0 ? (
            <div className="text-center p-4" suppressHydrationWarning={true}>
              Tidak ada proyek yang tersedia.
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                session={session}
                key={project.id}
                project={project}
                employee={employee}
                onStatusUpdate={handleProjectStatusUpdate} // Pass callback to ProjectCard
              />
            ))
          )}
        </div>
        <div
          className="flex justify-center mt-4"
          suppressHydrationWarning={true}
        >
          <Button
            onClick={async () => {
              if (currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                await updateProjects(newPage);
              }
            }}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mt-1 ml-2 mr-2">
            {currentPage} of {totalPages}
          </span>
          <Button
            onClick={async () => {
              if (currentPage < totalPages) {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                await updateProjects(newPage);
              }
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
