"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/app/types/tasks"; // Adjust the path accordingly
import { Button } from "@/components/ui/button";
import { updateTask } from "@/app/action/task";

// Function to group tasks by project name
const groupTasksByProject = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    const projectName = task.project.name;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });
};

const TaskIndex = ({
  initialTasks,
  session,
}: {
  initialTasks: Task[];
  session: any;
}) => {
  // State to manage tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Group tasks by project name
  const groupedTasks = groupTasksByProject(tasks);

  const assignTask = async (id: string) => {
    // Update the status locally first
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Sudah Selesai" } : task
      )
    );

    // Call the API to update the task
    await updateTask(id, "Sudah Selesai");
  };

  return (
    <div className="flex flex-col mt-4 p-4">
      {tasks.length > 0 ? (
        Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
          <div key={projectName} className="mb-4">
            <h2 className="text-lg font-semibold">{projectName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectTasks.map((task) => (
                <Card key={task.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{task.project.name}</CardTitle>
                    <CardTitle>{task.employee.name}</CardTitle>
                    <CardDescription>
                      <span
                        className={`text-white border rounded-xl px-4 ${
                          task.status.trim() === "Belum Selesai"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        Status: {task.status}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {task.description}
                  </CardContent>
                  <CardFooter>
                    <p suppressHydrationWarning>
                      Due Date: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </CardFooter>
                  <div>
                    {session.user.role === "EMPLOYEE" &&
                    task.employee.role === "EMPLOYEE" &&
                    task.status === "Belum Selesai" ? (
                      <Button
                        variant="outline"
                        onClick={() => assignTask(task.id)}
                      >
                        Finish Task
                      </Button>
                    ) : session.user.role === "EMPLOYEE" &&
                      task.employee.role === "EMPLOYEE" ? (
                      <Button variant="outline" disabled>
                        Finish Task
                      </Button>
                    ) : null}{" "}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TaskIndex;
