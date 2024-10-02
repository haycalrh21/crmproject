"use client";
import { createEmployee } from "@/app/action/employee";
import { useRouter } from "next/navigation";
import React from "react";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const employee = await createEmployee(name, email, password);
      router.push("/login");
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 w-full border  rounded-md p-2 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full border  rounded-md p-2 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full border  rounded-md p-2 focus:border-black focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
