import { loginEmployee } from "@/app/action/employee";
import { getPayments } from "@/app/action/payment";
import { getProjectPayment } from "@/app/action/project";
import { auth } from "@/app/auth";

import PaymentIndex from "@/components/dashboard/payment/PaymentIndex";
import React from "react";
export const revalidate = 300;

const page = async () => {
  const session = await auth();

  const userLogin = await loginEmployee(session?.user?.id as string);

  const getProjectPayments = await getProjectPayment();

  const getpaymentall = await getPayments();

  // Filter payments based on companyId from userLogin
  const filteredPayments = getpaymentall.filter(
    (payment) => payment.companyId === userLogin?.companyId
  );

  // Transformasi data agar `user` dipindahkan ke dalam `payment`
  const transformedPayments = filteredPayments.map((payment) => ({
    id: payment.id, // Pastikan ID pembayaran ditambahkan
    amount: payment.amount.toString(), // Konversi amount ke string
    status: payment.status, // Pastikan status juga ditambahkan
    project: {
      id: payment.project.id, // ID project
      name: payment.project.name, // Nama project
      user: {
        id: payment.project.user.id, // ID user dari project
        name: payment.project.user.name, // Nama user dari project
      },
    },
  }));

  return (
    <div>
      <PaymentIndex
        session={userLogin}
        project={getProjectPayments}
        payment={transformedPayments}
      />
    </div>
  );
};

export default page;
