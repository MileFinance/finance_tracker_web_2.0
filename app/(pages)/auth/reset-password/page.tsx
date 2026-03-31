"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="hero-gradient-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-2 h-72 w-72 rounded-full bg-[#FFB95D]/25 blur-3xl" />
        <div className="absolute -right-16 bottom-4 h-80 w-80 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <section className="relative grid h-full w-full overflow-hidden bg-black/50 backdrop-blur-sm lg:grid-cols-2">
        <aside className="hero-gradient-card hidden h-full flex-col justify-between p-12 text-white lg:flex">
          <div className="space-y-4">
            <Image
              src="/logo/Logo.svg"
              alt="Mile logo"
              width={1600}
              height={400}
              className="h-10 w-auto"
              priority
            />
            <p className="w-fit rounded-full border border-[#FFB95D]/45 bg-[#FFB95D]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#FFB95D]">
              SECURITY CHECKPOINT
            </p>
            <h1 className="text-4xl font-black leading-tight">
              Choose a new password
              <br />
              for your account.
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
            Use a strong password with at least 8 characters, including letters,
            numbers, and symbols when possible.
          </p>
        </aside>

        <div className="flex items-center justify-center bg-black/65 p-8 text-white sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Image
              src="/logo/Logo.svg"
              alt="Mile logo"
              width={1600}
              height={400}
              className="mb-4 h-8 w-auto lg:hidden"
              priority
            />
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">
                Reset password
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Set your new password
              </h2>
              <p className="mt-2 text-sm text-white/70">
                This reset link works once and expires in 30 minutes.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="text-center text-white/70">Loading...</div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
