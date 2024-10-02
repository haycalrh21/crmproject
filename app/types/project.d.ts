// types.ts (atau nama file sesuai preferensi)
export interface Project {
  id: string;
  name: string;
  description: string;
  user: { id: string; name: string };
  employee: { id: string; name: string };
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus; // Pastikan ProjectStatus juga diimpor atau didefinisikan
}

export interface Client {
  id: string;
  name: string;
  companyId: string;
}

export interface Employee {
  id: string;
  name: string;
}
