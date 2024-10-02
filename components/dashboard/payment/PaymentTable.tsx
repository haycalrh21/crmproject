import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import PaymentDropdownMenu from "./PaymentDropdownMenu";

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
  return (
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
  );
};

export default PaymentTable;
