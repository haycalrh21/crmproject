import { auth } from "@/app/auth";
import prisma from "@/app/lib/prismaClient";
import TaskIndex from "@/components/dashboard/task/TaskIndex";
import React from "react";
import { Task } from "@/app/types/tasks";
import { Employee } from "@/app/types/tasks";

export const revalidate = 60;

const TaskPage = async () => {
  const session = await auth();

  // Fetch the employee with their tasks based on session user ID
  const userLogin: Employee | null = await prisma.employee.findUnique({
    where: {
      id: session?.user?.id as string,
    },
    include: {
      tasks: {
        include: {
          employee: true, // Ensure employee data is included in each task
          project: true, // Ensure project data is included in each task
        },
      },
    },
  });

  if (!userLogin || !userLogin.companyId) {
    console.error("User not found or not associated with any company");
    return <div>No tasks found.</div>; // or a suitable message
  }

  const { role } = userLogin;
  let tasks: Task[] = [];

  // Check roles and fetch tasks accordingly
  if (role === "OWNER" || role === "PROJECT_MANAGER") {
    // Fetch all tasks for the company
    tasks = await prisma.task.findMany({
      where: {
        employee: {
          companyId: userLogin.companyId,
        },
      },
      include: {
        employee: true,
        project: true, // Ensure project data is included for each task
      },
    });
  } else if (role === "EMPLOYEE") {
    // Only fetch tasks for the logged-in employee
    tasks = userLogin.tasks as Task[]; // Ensure casting to Task[]
  }

  return (
    <div>
      <TaskIndex initialTasks={tasks} session={session} />
    </div>
  );
};

export default TaskPage;
