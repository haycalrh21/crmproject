import ProjectIndex from "@/components/dashboard/projects/ProjectIndex";
import React from "react";
export const revalidate = 60;
const page = () => {
  return (
    <div className="">
      <ProjectIndex />
    </div>
  );
};

export default page;
