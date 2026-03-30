"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";

export default function RegisterView() {
    const router = useRouter();
    const { register, authError, clearAuthError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const passwordMismatch = useMemo(
        () => confirmPassword.length > 0 && password !== confirmPassword,
        [password, confirmPassword],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLocalError(null);
        clearAuthError();

        if (!acceptedTerms) {
            setLocalError("You must accept terms and privacy policy.");
            return;
        }
        if (passwordMismatch) {
            setLocalError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await register({ email, password, name });
            router.push("/mainApp?view=dashboard");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 py-12 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#9ef01a]/20 blur-3xl" />
                <div className="absolute -right-12 bottom-0 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            </div>

            <section className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
                <aside className="hidden h-full flex-col justify-between bg-linear-to-br from-black to-neutral-900 p-10 text-white lg:flex">
                    <div className="space-y-4">
                        <p className="w-fit rounded-full border border-[#9ef01a]/70 bg-[#9ef01a]/15 px-4 py-1 text-sm font-semibold tracking-wide text-[#9ef01a]">
                            FINANCE TRACKER
                        </p>
                        <h1 className="text-4xl font-bold leading-tight">
                            Start fresh.
                            <br />
                            Build better money habits.
                        </h1>
                    </div>
                    <p className="max-w-sm text-sm font-medium text-white/80">
                        Create your account to track spending, set smart budgets, and understand your financial flow in one place.
                    </p>
                </aside>

                <div className="bg-white p-8 sm:p-10">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-600">Sign Up</p>
                            <h2 className="mt-3 text-3xl font-bold text-black">Create Account</h2>
                            <p className="mt-2 text-sm text-neutral-700">Set up your profile to begin managing your finances.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {localError || authError ? (
                                <p className="rounded-xl border border-rose-400/40 bg-rose-100 px-3 py-2 text-sm text-rose-700">
                                    {localError ?? authError}
                                </p>
                            ) : null}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-semibold text-black">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter your full name"
                                    className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-black placeholder-black outline-none ring-0 transition focus:border-[#9ef01a] focus:shadow-[0_0_0_4px_rgba(158,240,26,0.25)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-black">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Enter your email"
                                    className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-black placeholder-black outline-none ring-0 transition focus:border-[#9ef01a] focus:shadow-[0_0_0_4px_rgba(158,240,26,0.25)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-black">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="Create password"
                                        className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-black placeholder-black outline-none ring-0 transition focus:border-[#9ef01a] focus:shadow-[0_0_0_4px_rgba(158,240,26,0.25)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-black">
                                        Confirm
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        placeholder="Confirm password"
                                        className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-black placeholder-black outline-none ring-0 transition focus:border-[#9ef01a] focus:shadow-[0_0_0_4px_rgba(158,240,26,0.25)]"
                                    />
                                </div>
                            </div>

                            {passwordMismatch ? <p className="text-xs font-semibold text-rose-600">Passwords do not match.</p> : null}

                            <label className="inline-flex items-center gap-2 pt-1 text-sm text-neutral-800">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 text-[#9ef01a] focus:ring-[#9ef01a]"
                                />
                                I agree to the terms and privacy policy.
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 h-12 w-full rounded-xl bg-black text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#9ef01a] hover:text-black focus:outline-none focus:shadow-[0_0_0_4px_rgba(158,240,26,0.35)]"
                            >
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </button>

                            <p className="pt-2 text-center text-sm text-neutral-700">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="font-semibold text-black transition hover:text-[#9ef01a]">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
