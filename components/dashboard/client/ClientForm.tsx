"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/app/action/client";

const ClientForm = ({
  session,
  onClientAdded,
  onClose,
}: {
  session: any;
  onClientAdded: (client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId?: string | null;
  }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const companyId = session.companyId;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session?.role !== "OWNER" && session?.role !== "PROJECT_MANAGER") {
      alert("Anda bukan Owner");
      return;
    }

    const newClient = await createClient(name, email, phone, companyId);
    onClientAdded(newClient);
    setName("");
    setEmail("");
    setPhone("");
    onClose(); // Close the dialog after submitting
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="col-span-3"
          />
        </div>
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
};

export default ClientForm;
