"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/app/context/authContext";
import PageLoader from "@/app/components/pageLoader";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <PageLoader />
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
