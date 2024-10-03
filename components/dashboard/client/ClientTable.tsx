"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientDelete from "./ClientDelete";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ClientTable = ({
  clients,
  handleDeleted,
}: {
  clients: { id: string; name: string; email: string; phone: string }[];
  handleDeleted: (id: string) => void; // Correct the prop type
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulasi jeda loading dengan setTimeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Jeda 2 detik

    // Cleanup timer saat komponen unmount
    return () => clearTimeout(timer);
  }, [clients]);
  const openDialog = (id: string) => {
    setSelectedClientId(id); // Set the selected client ID
    setOpenModal(true);
  };

  const closeDialog = () => {
    setOpenModal(false);
    setSelectedClientId(null); // Reset selected client ID
  };

  return (
    <div className="overflow-auto max-h-200">
      {loading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger> </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>. . . </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openDialog(client.id)}>
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedClientId && (
        <ClientDelete
          id={selectedClientId}
          open={openModal}
          closeDialog={closeDialog}
          onDelete={handleDeleted} // Pass the handleDeleted function to ClientDelete
        />
      )}
    </div>
  );
};

export default ClientTable;
