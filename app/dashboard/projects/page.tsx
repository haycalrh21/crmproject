import ProjectIndex from "@/components/dashboard/projects/ProjectIndex";
import React from "react";
export const revalidate = 300;
const page = () => {
  return (
    <div>
      <ProjectIndex />
    </div>
  );
};

export default page;
