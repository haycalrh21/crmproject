// tasks.d.ts
export interface Task {
  id: string;
  projectId: string;
  employeeId: string;
  description: string;
  status: string;
  dueDate: Date; // Keep as Date
  createdAt: Date; // Change this to Date for consistency
  employee: {
    id: string;
    name: string;
    role: string | null;
    email: string;
    phone: string | null;
  };
  project: {
    id: string;
    name: string;
    description: string;
    userId: string;
    employeeId: string;
    startDate: Date;
    endDate: Date | null;
    status: ProjectStatus;
  };
}

// Employee interface
interface Employee {
  id: string;
  companyId: string | null;
  role: string | null;
  name: string;
  email: string;
  phone: string | null;
  password: string; // Ensure this is handled securely
  createdAt: Date;
  tasks: Task[]; // Ensure tasks is included
}
