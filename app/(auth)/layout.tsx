import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md p-6 e srounded-lg">{children}</div>
    </div>
  );
};

export default AuthLayout;
