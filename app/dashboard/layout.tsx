import React from "react";
import Navbar from "../../components/navbar";
import { auth } from "../auth";
import { SignOut } from "../../components/ButtonLogout";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div className="flex h-screen">
      {/* Navbar mengelola state sidebar */}

      {/* Konten utama akan ditampilkan di bawah navbar */}
      <div className="flex-1">
        <Navbar children={children} session={session} />
      </div>
    </div>
  );
};

export default DashboardLayout;
