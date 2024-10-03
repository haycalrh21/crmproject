import { updatePayment } from "@/app/action/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PaymentEdit = ({ data, onClose }: { data: any; onClose: () => void }) => {
  const [selectStatus, setSelectStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await updatePayment(data.id, selectStatus as string);
      setLoading(false);
      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                onValueChange={(value) => setSelectStatus(value)}
                value={selectStatus || undefined}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={selectStatus || "Select a Status"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sudah Bayar">Sudah Bayar</SelectItem>
                </SelectContent>
              </Select>
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

        {/* Tombol untuk menutup dialog */}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentEdit;
