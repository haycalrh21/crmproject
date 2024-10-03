import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import Spinner from "@/components/ui/Spinner";

const PaymentForm = ({
  project,
  loading,
  handleSubmit,
  setSelectedProjectId,
  setAmount,
  setSelectedStatus,
  setDueDate, // Tetap meneruskan setDueDate ke parent untuk digunakan di PaymentIndex
}: {
  loading: boolean;
  project: { id: string; name: string; user: { name: string } }[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setSelectedProjectId: (value: string | null) => void;
  setAmount: (value: string) => void;
  setSelectedStatus: (value: string | null) => void;
  setDueDate: (date: Date | undefined) => void; // Passed from parent
}) => {
  const [dueDate, setLocalDueDate] = useState<Date | undefined>(new Date());
  const handleDateChange = (date: Date | undefined) => {
    setLocalDueDate(date); // Update local state for selected date
    setDueDate(date); // Update the parent component's state
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Tambah Pembayaran</DialogTitle>
        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Project" className="text-right">
                  Id Project - Nama Project
                </Label>
                <Select onValueChange={(value) => setSelectedProjectId(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        Nama Project: {project.name} - Pic:{" "}
                        {project.user?.name || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  className="col-span-3 border rounded-md"
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Status" className="text-right">
                  Status
                </Label>
                <Select onValueChange={(value) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum bayar">Belum bayar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDateChange} // Local handler to update dueDate
                  className="col-span-3 border rounded-md"
                />
              </div>
            </div>
            {loading ? (
              <Button type="submit">
                <Spinner className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default PaymentForm;
