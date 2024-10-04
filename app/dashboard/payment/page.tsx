import { loginEmployee } from "@/app/action/employee";
import { getPayments } from "@/app/action/payment";
import { auth } from "@/app/auth";
import PaymentIndex from "@/components/dashboard/payment/PaymentIndex";
import React from "react";

export const revalidate = 300;

const page = async () => {
  const session = await auth();
  const userLogin = await loginEmployee(session?.user?.id as string);

  // Pastikan companyId tidak null sebelum mengambil pembayaran
  if (!userLogin?.companyId) {
    return <div>Nothing in here</div>; // Jika tidak ada companyId
  }

  // Ambil semua pembayaran berdasarkan companyId dari userLogin
  const getProjectPayments = await getPayments(userLogin.companyId); // Ganti dengan userLogin.companyId
  // console.log(getProjectPayments);

  // Jika tidak ada pembayaran, tampilkan pesan
  if (!getProjectPayments || getProjectPayments.length === 0) {
    return <div>Tidak ada apa-apa</div>; // Jika tidak ada pembayaran
  }

  // Ambil projectId dari pembayaran dan buat array proyek
  const projects = getProjectPayments.map((payment) => ({
    id: payment.project.id,
    name: payment.project.name,
    user: {
      id: payment.project.user.id,
      name: payment.project.user.name,
    },
  }));

  return (
    <div>
      <PaymentIndex
        session={userLogin}
        project={projects} // Lempar project dengan struktur yang sesuai
        payment={getProjectPayments} // Lempar payment juga
      />
    </div>
  );
};

export default page;
