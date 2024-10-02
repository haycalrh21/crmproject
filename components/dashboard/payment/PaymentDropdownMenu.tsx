import { useState } from "react"; // Impor useState untuk mengelola state
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import PaymentEdit from "./PaymentEdit";

const PaymentDropdownMenu = ({ data }: { data: any }) => {
  const [dialogOpen, setDialogOpen] = useState(false); // State untuk mengontrol dialog

  const handleEditClick = () => {
    setDialogOpen(true); // Membuka dialog saat opsi Edit diklik
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEditClick}>
            Edit Payment {/* Trigger dialog */}
          </DropdownMenuItem>
          <DropdownMenuItem>Hapus</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render PaymentEdit dialog jika dialogOpen adalah true */}
      {dialogOpen && (
        <PaymentEdit
          data={data}
          onClose={() => setDialogOpen(false)} // Menambahkan fungsi untuk menutup dialog
        />
      )}
    </div>
  );
};

export default PaymentDropdownMenu;
