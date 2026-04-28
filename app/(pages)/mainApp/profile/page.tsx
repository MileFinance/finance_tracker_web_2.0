"use client";

import { useAuth } from "@/app/hooks/api/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IE", { year: "numeric", month: "long" })
    : "—";

  return (
    <div className="w-full flex-1 overflow-y-auto bg-mainapp p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <header className="rounded-md border border-surface bg-transparent p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Account</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Profile</h1>
        </header>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <article className="rounded-md border border-surface bg-transparent p-5">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-surface bg-transparent text-3xl font-bold text-white">
              {initials}
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-white">{user?.name ?? "—"}</h2>
            <p className="text-center text-sm text-neutral-400">{user?.email ?? "—"}</p>
            <div className="mt-5 space-y-2">
              <p className="rounded-sm border border-surface bg-transparent px-3 py-2 text-sm text-neutral-300">
                ID: {user?.id ?? "—"}
              </p>
              <p className="rounded-sm border border-surface bg-transparent px-3 py-2 text-sm text-neutral-300">
                Member since: {memberSince}
              </p>
              <p className="rounded-sm border border-surface bg-transparent px-3 py-2 text-sm text-neutral-300">
                2FA: {user?.two_factor_enabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </article>

          <div className="space-y-4">
            <section className="rounded-md border border-surface bg-transparent p-5">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Full Name
                  <input
                    defaultValue={user?.name ?? ""}
                    className="rounded-sm border border-surface bg-transparent px-3 py-2 text-white"
                  />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-neutral-300">
                  Email
                  <input
                    defaultValue={user?.email ?? ""}
                    className="rounded-sm border border-surface bg-transparent px-3 py-2 text-white"
                  />
                </label>
              </div>
              <button
                type="button"
                className="mt-4 rounded-sm border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf]"
              >
                Save Profile
              </button>
            </section>

            <section className="rounded-md border border-surface bg-transparent p-5">
              <h3 className="text-lg font-semibold text-white">Security</h3>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-sm border border-surface bg-transparent px-4 py-3 text-left"
                >
                  <span className="text-sm text-neutral-300">Change Password</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-sm border border-surface bg-transparent px-4 py-3 text-left"
                >
                  <span className="text-sm text-neutral-300">Two-factor Authentication</span>
                  <span className={`text-xs ${user?.two_factor_enabled ? "text-[#2dd4bf]" : "text-neutral-400"}`}>
                    {user?.two_factor_enabled ? "Enabled" : "Disabled"}
                  </span>
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
