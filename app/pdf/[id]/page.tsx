import React from "react";
import { getPaymentId } from "@/app/action/payment";
import InvoicePage from "@/components/pdf/InvoicePdf";

const PdfPage = async ({ params }: { params: { id: string } }) => {
  let data;
  try {
    data = await getPaymentId(params.id);
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching payment data:", error);
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto p-5 bg-white border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Unable to fetch invoice data. Please try again later.</p>
      </div>
    );
  }

  return <InvoicePage data={data} />;
};

export default PdfPage;
