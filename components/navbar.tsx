"use client";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import { Columns2 } from "lucide-react";

const Navbar = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar di kiri */}
      <Sidebar
        isOpen={isOpen}
        className={`${isOpen ? "block" : "hidden"} md:block`}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar di atas */}
        <div className="bg-white shadow-md flex justify-start gap-4 items-center p-4">
          <Columns2
            onClick={toggleSidebar}
            className="cursor-pointer block md:hidden"
          />
          <h1 className="text-xl font-bold">CRM Dashboard</h1>
          <div className="flex items-center space-x-4 ml-auto">
            <p>{session?.user?.name}</p>
          </div>
        </div>

        {/* Konten utama yang akan di-scroll */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
