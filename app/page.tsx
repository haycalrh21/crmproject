"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    router.push("/login");
  }
};

export default Home;
