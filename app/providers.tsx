"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/app/context/authContext";
import PageLoader from "@/app/components/pageLoader";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PageLoader />
      {children}
    </AuthProvider>
  );
}
