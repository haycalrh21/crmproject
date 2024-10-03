import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import PaymentDropdownMenu from "./PaymentDropdownMenu";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentTable = ({
  payment = [], // Fallback to empty array
}: {
  payment?: {
    id: string;
    amount: string;
    status: string;
    project: {
      id: string;
      name: string;
      user: {
        name: string;
      };
    };
  }[];
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (payment) {
      setLoading(false); // Only set loading to false when payment data exists
    } else {
      setLoading(true); // Keep loading if payment is null or undefined
    }
  }, [payment]);

  return (
    <div>
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
              <TableCell>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id - Name Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payment.length > 0 ? (
              payment.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    {data.project.name} - {data.project.id}
                  </TableCell>
                  <TableCell>{data.project.user.name}</TableCell>
                  <TableCell>{data.amount}</TableCell>
                  <TableCell>{data.status}</TableCell>
                  <TableCell className="text-right">
                    <PaymentDropdownMenu data={data} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PaymentTable;
