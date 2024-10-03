"use client";
import React, { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton"; // Tambahkan komponen Skeleton
import { useToast } from "@/hooks/use-toast";

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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();

  const groupedTasks = groupTasksByProject(tasks);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (groupedTasks) {
      setLoading(false); // Only set loading to false when payment data exists
    } else {
      setLoading(true); // Keep loading if payment is null or undefined
    }
  }, [groupedTasks]);

  const assignTask = async (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Sudah Selesai" } : task
      )
    );

    await updateTask(id, "Sudah Selesai");
    toast({
      title: "Success",
      description: "Task assigned successfully",
    });
  };

  return (
    <div className="flex flex-col mt-4 p-4">
      {loading ? (
        // Tampilan loading menggunakan Skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader suppressHydrationWarning>
                <Skeleton className="w-[150px] h-[20px] rounded" />
                <Skeleton className="w-[100px] h-[20px] mt-2 rounded" />
                <CardDescription>
                  <Skeleton className="w-[100px] h-[20px] mt-2 rounded" />
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="w-full h-[100px] rounded" />
              </CardContent>
              <CardFooter>
                <Skeleton className="w-[100px] h-[20px] rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : tasks.length > 0 ? (
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
        <div>
          <p>No tasks available.</p>
        </div>
      )}
    </div>
  );
};

export default TaskIndex;
