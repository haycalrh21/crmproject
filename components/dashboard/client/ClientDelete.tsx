import { deleteClient } from "@/app/action/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ClientDelete = ({
  id,
  open,
  closeDialog,
  onDelete,
}: {
  id: string;
  open: boolean;
  closeDialog: () => void;
  onDelete: (id: string) => void;
}) => {
  const handleDelete = async () => {
    try {
      // Call the delete function with the client id
      await deleteClient(id);

      onDelete(id); // Notify parent component about deletion
      closeDialog(); // Close the dialog after deletion
    } catch (error) {
      console.error("Failed to delete client:", error);
      // Optionally handle the error (e.g., show a notification)
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Do you want to proceed?
          </DialogDescription>
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="ml-2"
            >
              Delete
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDelete;
