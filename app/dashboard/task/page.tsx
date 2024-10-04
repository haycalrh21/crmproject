import { auth } from "@/app/auth";

import TaskIndex from "@/components/dashboard/task/TaskIndex";
import React from "react";

import { fetchTasksForUser } from "@/app/action/employee";

export const revalidate = 300;

const TaskPage = async () => {
  const session = await auth();

  const tasks = await fetchTasksForUser(session?.user?.id as string); // Panggil server action untuk ambil task

  if (tasks.length === 0) {
    return <div>No tasks found.</div>; // Bisa disesuaikan pesan ini
  }

  return (
    <div>
      <TaskIndex initialTasks={tasks} session={session} />
    </div>
  );
};

export default TaskPage;
