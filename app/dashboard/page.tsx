import CardIndex from "@/components/dashboard/CardIndex";
import React from "react";

export const revalidate = 300;

const DashboardPage = async () => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="p-4 flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg">Dashboard</p>
        <p className="mt-2 text-md">Current Time: {currentTime}</p>
        <CardIndex />
      </div>
    </div>
  );
};

export default DashboardPage;
