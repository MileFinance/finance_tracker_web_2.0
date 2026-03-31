"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unable to reset password right now.";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.resetPassword({
        token,
        new_password: newPassword,
      });

      setSuccessMessage(response.message ?? response.status ?? "Password reset successful. Redirecting to login...");
      window.setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {successMessage}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-semibold text-white/90">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Enter a strong password"
          className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-semibold text-white/90">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter password"
          className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
        />
      </div>

      {passwordMismatch ? (
        <p className="text-xs font-semibold text-rose-300">Passwords do not match.</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || passwordMismatch}
        className="mt-2 h-12 w-full rounded-xl bg-[#FFB95D] text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd39a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,185,93,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>

      <p className="pt-2 text-center text-sm text-white/70">
        Back to{" "}
        <Link href="/auth/login" className="font-semibold text-[#FFB95D] transition hover:text-[#ffd39a]">
          Log in
        </Link>
      </p>
    </form>
  );
}
