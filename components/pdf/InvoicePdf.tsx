import React from "react";
import Image from "next/image";

const InvoicePage = ({ data }: { data: any }) => {
  const { company, amount, status, createdAt, project, dueDate } = data;

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white border rounded-lg shadow-md">
      {/* Company Information */}
      <div className="flex items-center mb-4">
        {company?.logo && (
          <Image
            src={company.logo}
            alt={`${company.name} Logo`}
            width={48}
            height={48}
            className="mr-3"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{company?.name}</h1>
          <p className="text-gray-600">{company?.address}</p>
          <p className="text-gray-600">{company?.phone}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* Invoice Details */}
      <h2 className="text-xl font-semibold">Invoice Details</h2>
      <p className="mt-2">
        <strong>Project:</strong> {project?.name}
      </p>
      <p>
        <strong>Amount:</strong>{" "}
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(amount))}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Date Payment:</strong>{" "}
        {new Date(createdAt).toLocaleDateString("id-ID")}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {new Date(dueDate).toLocaleDateString("id-ID")}
      </p>

      <hr className="my-4" />

      {/* Project Details */}
      <h2 className="text-lg font-semibold">Project Details</h2>
      <p>
        <strong>Description:</strong> {project?.description}
      </p>
      <p>
        <strong>Start Date:</strong>{" "}
        {new Date(project?.startDate).toLocaleDateString("id-ID")}
      </p>
      <p>
        <strong>End Date:</strong>{" "}
        {new Date(project?.endDate).toLocaleDateString("id-ID")}
      </p>
      <p>
        <strong>Status:</strong> {project?.status}
      </p>

      {/* Client Information */}
      <h2 className="text-lg font-semibold mt-4">Client Information</h2>
      <p>
        <strong>Name:</strong> {project?.user?.name}
      </p>
      <p>
        <strong>Email:</strong> {project?.user?.email}
      </p>
      <p>
        <strong>Phone:</strong> {project?.user?.phone}
      </p>

      {/* Footer */}
      <div className="mt-5 text-center">
        <p className="text-gray-500">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoicePage;
