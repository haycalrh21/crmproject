import Link from "next/link";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "./ButtonLogout";
import {
  CircleX,
  Contact,
  DollarSign,
  FolderCheckIcon,
  FolderOpenDot,
  LogOut,
} from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Building2 } from "lucide-react";
import { Users } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = ({
  isOpen,
  onClose,
  className,
}: {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null); // Reference to the sidebar

  // Function to handle outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      onClose(); // Close sidebar if click is outside
    }
  };

  // Menambahkan event listener ketika sidebar terbuka
  if (typeof window !== "undefined" && isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return (
    <div
      ref={sidebarRef} // Reference the sidebar div
      className={`bg-gray-800 text-white p-6 transition-transform duration-300 fixed inset-y-0 left-0 z-10 overflow-y-auto h-screen ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:translate-x-0 md:w-64`}
    >
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-lg font-bold">CRM Dashboard</h2>
        <CircleX onClick={onClose} className="cursor-pointer block md:hidden" />
      </div>
      <ul className="space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard" ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
        >
          <LayoutDashboard />
          Home
        </Link>
        <Link
          href="/dashboard/company"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/company"
              ? "bg-gray-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Building2 />
          Company
        </Link>
        <Link
          href="/dashboard/employee"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/employee"
              ? "bg-gray-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Users />
          Employee
        </Link>
        <Link
          href="/dashboard/client"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/client"
              ? "bg-gray-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Contact />
          Client
        </Link>
        <Link
          href="/dashboard/projects"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/projects"
              ? "bg-gray-600"
              : "hover:bg-gray-700"
          }`}
        >
          <FolderOpenDot />
          Projects
        </Link>
        <Link
          href="/dashboard/task"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/task" ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
        >
          <FolderCheckIcon />
          Task
        </Link>
        <Link
          href="/dashboard/payment"
          className={`flex items-center p-2 rounded justify-start gap-4 ${
            pathname === "/dashboard/payment"
              ? "bg-gray-600"
              : "hover:bg-gray-700"
          }`}
        >
          <DollarSign />
          Payment
        </Link>
        <li
          className="hover:bg-gray-700 flex items-center p-2 rounded justify-start gap-4 cursor-pointer"
          onClick={onClose}
        >
          <LogOut />
          <SignOut />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
