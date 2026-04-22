"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-mainapp px-4">
      <div className="w-full max-w-md">
        <Image src="/logo/LogoHeader.png" alt="Shiru" width={80} height={40} className="mb-12" />

        <p className="text-sm font-medium tracking-[0.12em] text-neutral-500">404</p>
        <h1 className="mt-2 text-4xl font-black text-white">Page not found</h1>
        <p className="mt-3 text-sm text-neutral-500">
          This page doesn't exist or was moved. Check the URL or head back to safety.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/mainApp?view=dashboard"
            className="flex items-center justify-center gap-2 rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Go to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-sm border border-surface px-4 py-3 text-sm font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
