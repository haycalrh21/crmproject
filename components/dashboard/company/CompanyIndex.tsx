"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createCompany, uploadImage } from "@/app/action/company";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Spinner from "@/components/ui/Spinner";

interface CompanyData {
  id: string;
  name: string;
  address: string;
  logo: string;
  phone: string;
}

const CompanyIndex = ({
  session,
  data,
}: {
  session: any;
  data: CompanyData | null;
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [employeeId] = useState(session?.user?.id);
  const [companyData, setCompanyData] = useState<CompanyData | null>(data);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);

      const reader = new FileReader();
      let simulatedProgress = 0;

      reader.onloadstart = () => {
        setProgress(0);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );

          if (simulatedProgress < percentCompleted) {
            const increment = Math.min(1, percentCompleted - simulatedProgress);
            const delay = 25;

            const updateProgress = (newProgress: any) => {
              if (simulatedProgress < newProgress) {
                simulatedProgress++;
                setProgress(simulatedProgress);
                setTimeout(() => updateProgress(newProgress), delay);
              }
            };

            updateProgress(percentCompleted);
          }
        }
      };

      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        try {
          const uploadedLogoUrl = await uploadImage(base64Image);
          setLogoUrl(uploadedLogoUrl);
        } catch (error) {
          console.error("Error uploading logo:", error);
          setLogoUrl(null);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setLogo(null);
      setLogoUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!logoUrl) {
      console.error("No logo URL available");
      return;
    }

    try {
      const newCompany = await createCompany({
        name,
        address,
        phone,
        logo: logoUrl,
        employeeId: String(employeeId),
      });
      setLoading(false);
      setCompanyData(newCompany);
      event.currentTarget.reset();
      setLogoUrl(null);
      setName("");
      setAddress("");
      setPhone("");
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <div className="flex flex-col items-start p-6 bg-gray-50">
      {companyData ? (
        <div className="text-left mb-6">
          <div className="relative inline-block mb-4">
            <Image
              src={companyData.logo}
              alt="Logo"
              width={200}
              height={200}
              className="rounded-full border-4 border-blue-500 shadow-lg transition-transform transform hover:scale-105"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {companyData.name}
          </h2>
          <p className="text-gray-600">{companyData.address}</p>
          <p className="text-gray-600">{companyData.phone}</p>
        </div>
      ) : (
        <div className="text-left">
          <p className="text-lg text-gray-700 mb-4">
            No company data available.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                Tambahkan Perusahaan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  Tambahkan Perusahaan
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Buat isi data perusahaan
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="name"
                      className="text-right font-semibold text-gray-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      className="col-span-3 border border-gray-300 rounded-lg p-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="address"
                      className="text-right font-semibold text-gray-700"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      className="col-span-3 border border-gray-300 rounded-lg p-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="phone"
                      className="text-right font-semibold text-gray-700"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="col-span-3 border border-gray-300 rounded-lg p-2"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="logo"
                      className="text-right font-semibold text-gray-700"
                    >
                      Logo
                    </Label>
                    <Input
                      type="file"
                      name="logo"
                      className="col-span-3 border border-gray-300 rounded-lg p-2"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <div className="grid items-center gap-4">
                    <Progress
                      value={progress}
                      className="h-2 bg-blue-200 rounded-full"
                    />
                  </div>
                </div>
                {loading ? (
                  <Button type="submit">
                    <Spinner className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default CompanyIndex;
