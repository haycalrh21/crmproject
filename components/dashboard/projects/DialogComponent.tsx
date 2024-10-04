// DialogComponent.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { createProject } from "@/app/action/project";
import { Project } from "@/app/types/project";
import { ProjectStatus } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

export const DialogComponent = ({
  session,
  setProjects,
  resetForm,
  client,
  employee,
}: {
  session: any;
  setProjects: (projects: any) => void;
  resetForm: () => void;
  client: { id: string; name: string }[];
  employee: { id: string; name: string; role: string; companyId: string }[];
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState<Date | undefined>(
    new Date()
  );

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  console.log(employee);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Validasi input
    if (
      !selectedClientId ||
      !selectedEmployeeId ||
      !selectedStatus ||
      !paymentAmount ||
      !paymentStatus ||
      !paymentDueDate
    ) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Ambil employee yang dipilih untuk mendapatkan companyId
      const selectedEmployee = employee.find(
        (emp) => emp.id === selectedEmployeeId
      );
      const companyId = selectedEmployee ? selectedEmployee.companyId : null;

      // Pastikan companyId ada
      if (!companyId) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Company ID not found.",
        });
        return;
      }

      // Panggil createProject dengan parameter yang sesuai
      const response = await createProject(
        name,
        description,
        selectedClientId,
        selectedEmployeeId,
        companyId, // Kirim companyId ke createProject
        startDate ? new Date(startDate) : new Date(),
        endDate ? new Date(endDate) : new Date(),
        selectedStatus as ProjectStatus,
        paymentAmount,
        paymentStatus,
        paymentDueDate
      );

      // Menangani respons dari createProject
      if (response && response.id) {
        const newProject = {
          id: response.id,
          name: response.name,
          description: response.description,
          user: {
            id: session.user.id,
            name: session.user.name,
          },
          employee: {
            id: selectedEmployeeId,
            name: selectedEmployee ? selectedEmployee.name : "",
          },
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
        };

        // Update state projects
        setProjects((prevProjects: Project[]) => {
          const isDuplicate = prevProjects.some(
            (proj) => proj.id === newProject.id
          );
          if (!isDuplicate) {
            const updatedProjects = [...prevProjects, newProject];
            return updatedProjects.length > 8
              ? updatedProjects.slice(-8)
              : updatedProjects;
          }
          return prevProjects;
        });

        toast({
          title: "Success",
          description: "Project created successfully",
        });

        resetForm();
        setDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employee.filter(
    (emp) => emp.role === "PROJECT_MANAGER"
  );

  return (
    <div className="col-span-1 mb-4" suppressHydrationWarning={true}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {session?.user?.role === "OWNER" ? (
            <Button variant="outline" className="mt-4">
              Tambahkan Project
            </Button>
          ) : (
            <Button variant="outline" disabled className="mt-4">
              Lihat Project
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tambahkan Project</DialogTitle>
            <DialogDescription>Buat isi Data Project</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Client" className="text-right">
                  Client
                </Label>
                <Select
                  onValueChange={(value) => {
                    const selectedClient = client.find((c) => c.name === value);
                    setSelectedClientId(selectedClient?.id || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nama Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {client.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Employee" className="text-right">
                  Employee
                </Label>
                <Select
                  onValueChange={(value) => {
                    const selectedEmployee = employee.find(
                      (e) => e.name === value && e.role === "PROJECT_MANAGER" // Filter by role
                    );
                    setSelectedEmployeeId(selectedEmployee?.id || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nama Karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map(
                      (
                        emp // Use the filtered list here
                      ) => (
                        <SelectItem key={emp.id} value={emp.name}>
                          {emp.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <div className="col-span-3 max-h-[250px] overflow-auto">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border p-2 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <div className="col-span-3 max-h-[250px] overflow-auto">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md border p-2 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select onValueChange={(value) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProjectStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Payment Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  className="col-span-3"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentStatus" className="text-right">
                  Payment Status
                </Label>
                <Select onValueChange={(value) => setPaymentStatus(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3 max-h-[250px] overflow-auto">
                  <Calendar
                    mode="single"
                    selected={paymentDueDate}
                    onSelect={setPaymentDueDate}
                    className="rounded-md border p-2 w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6">
              {loading ? (
                <Button type="submit">
                  <Spinner className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
