"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createPayment, getPayments } from "@/app/action/payment";
import PaymentForm from "./PaymentForm";
import PaymentTable from "./PaymentTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PaymentIndex = ({
  session,
  project,
  payment,
}: {
  session: any;
  payment: {
    id: string;
    amount: string;
    status: string;
    project: {
      id: string;
      name: string;
      user: {
        id: string;
        name: string;
      };
    };
  }[];
  project: {
    id: string;
    name: string;
    user: {
      id: string;
      name: string;
    };
  }[];
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payments, setPayments] = useState(payment);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const companyId = session.companyId;

  const fetchUpdatedPayments = async () => {
    const updatedPayments = await getPayments();
    const filteredPayments = updatedPayments.filter(
      (payment) => payment.companyId === companyId
    );
    setPayments(filteredPayments);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (session?.role !== "OWNER") {
      toast({
        title: "Error",
        description: "You are not authorized to create payment",
      });
      setLoading(false);
      return;
    }

    await createPayment(
      selectedProjectId ?? "",
      amount,
      selectedStatus ?? "",
      dueDate ?? new Date(),
      companyId
    );

    setLoading(false);
    toast({
      title: "Success",
      description: "Payment created successfully",
    });

    // Reset form fields
    setSelectedProjectId(null);
    setAmount("");
    setSelectedStatus(null);
    setDueDate(new Date());
    setDialogOpen(false);

    await fetchUpdatedPayments();
  };

  return (
    <div>
      <div suppressHydrationWarning>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <PaymentForm
            project={project}
            loading={loading}
            handleSubmit={handleSubmit}
            setSelectedProjectId={setSelectedProjectId}
            setAmount={setAmount}
            setSelectedStatus={setSelectedStatus}
            setDueDate={setDueDate}
          />
        </Dialog>
      </div>
      <PaymentTable payment={payments} />
    </div>
  );
};

export default PaymentIndex;
