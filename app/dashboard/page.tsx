import CardIndex from "@/components/dashboard/CardIndex";
import React from "react";

export const revalidate = 60;
const DashboardPage = async () => {
  return (
    <div className="p-4 flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg">Dashboard</p>
        <CardIndex />
      </div>
    </div>
  );
};

export default DashboardPage;
