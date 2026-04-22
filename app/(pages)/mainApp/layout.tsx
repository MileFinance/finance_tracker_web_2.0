"use client";

import NavBar from "@/app/components/navBar";
import { PortfolioProvider } from "@/app/components/mainApp/portfolioContext";
import { useAuth } from "@/app/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainAppLayout({
    children}
  : {
    children: React.ReactNode;
  }) {
    const { isHydrated, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isHydrated && !isAuthenticated) {
        router.replace("/");
      }
    }, [isHydrated, isAuthenticated, router]);

    if (!isHydrated || !isAuthenticated) {
      return (
        <main className="flex h-screen w-full items-center justify-center bg-mainapp text-neutral-300">
          Loading secure workspace...
        </main>
      );
    }

    return (
        <PortfolioProvider>
          <main className="flex h-screen w-full bg-mainapp">
            <NavBar />
            {children}
          </main>
        </PortfolioProvider>
    )
  }