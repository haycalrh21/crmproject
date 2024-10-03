"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/app/action/client";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const companyId = session.companyId;
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      if (session?.role !== "OWNER" && session?.role !== "PROJECT_MANAGER") {
        toast({
          title: "Error",
          description: "You are not authorized to create client",
        });
      }

      const newClient = await createClient(name, email, phone, companyId);
      setLoading(false);
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      onClientAdded(newClient);
      setName("");
      setEmail("");
      setPhone("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
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
            type="email"
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
      {loading ? (
        <Button type="submit">
          <Spinner className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
        </Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </form>
  );
};

export default ClientForm;
