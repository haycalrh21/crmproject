"use client";
import { SessionProvider, useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";

// Buat AuthContext untuk membagikan session
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  // Gunakan AuthContext untuk membagikan sesi dan status
  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
};

export default Provider;
