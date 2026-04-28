"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/hooks/api/useAuth";
import { apiClient } from "@/lib/api/client";
import { TrendingUp, DollarSign, Zap, BarChart2, ChevronRight, CheckCircle } from "lucide-react";

const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD"];

const GOALS = [
  {
    id: "growth",
    label: "Long-term Growth",
    description: "Build wealth steadily over years through index funds and equities.",
    icon: <TrendingUp size={20} />,
    suggestedName: "Long-term Growth",
  },
  {
    id: "dividend",
    label: "Dividend Income",
    description: "Generate passive income through dividend-paying stocks.",
    icon: <DollarSign size={20} />,
    suggestedName: "Dividend Income",
  },
  {
    id: "active",
    label: "Active Trading",
    description: "Capitalize on short-term market opportunities.",
    icon: <Zap size={20} />,
    suggestedName: "Active Trading",
  },
  {
    id: "balanced",
    label: "Balanced Portfolio",
    description: "Mix of growth and income with managed risk.",
    icon: <BarChart2 size={20} />,
    suggestedName: "Balanced Portfolio",
  },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current ? "w-8 bg-white" : i === current ? "w-8 bg-white/60" : "w-4 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [portfolioName, setPortfolioName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState("");

  function handleGoalSelect(goalId: string) {
    const goal = GOALS.find((g) => g.id === goalId);
    setSelectedGoal(goalId);
    setPortfolioName(goal?.suggestedName ?? "");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await apiClient.createPortfolio({ name: portfolioName, base_currency: baseCurrency }, token);
      setCreatedName(created.name);
      setStep(2);
    } catch {
      setError("Could not create portfolio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-mainapp px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <Image src="/logo/LogoHeader.png" alt="Shiru" width={80} height={40} />
          <StepIndicator current={step} total={3} />
        </div>

        {/* Step 0 — Goal */}
        {step === 0 && (
          <div>
            <p className="text-sm font-medium text-neutral-400">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">What's your investing goal?</h1>
            <p className="mt-2 text-sm text-neutral-500">
              This helps us set up your workspace. You can always change it later.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`rounded-sm border p-4 text-left transition-colors ${
                    selectedGoal === goal.id
                      ? "border-white bg-white/5 text-white"
                      : "border-surface text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                  }`}
                >
                  <span className="mb-2 flex items-center gap-2 font-semibold text-sm">
                    {goal.icon}
                    {goal.label}
                  </span>
                  <p className="text-xs text-neutral-500">{goal.description}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selectedGoal}
              onClick={() => setStep(1)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 1 — Portfolio setup */}
        {step === 1 && (
          <div>
            <p className="text-sm font-medium text-neutral-400">Almost there</p>
            <h1 className="mt-1 text-3xl font-black text-white">Set up your portfolio</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Name it and choose your base currency. You can create more from the app.
            </p>

            <form onSubmit={handleCreate} className="mt-6 flex flex-col gap-4">
              {error && (
                <p className="rounded-sm border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <label className="flex flex-col gap-1.5 text-sm text-neutral-300">
                <span className="font-medium">Portfolio Name</span>
                <input
                  required
                  autoFocus
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g. Long-term Growth"
                  className="rounded-sm border border-surface bg-transparent px-3 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-neutral-500"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-neutral-300">
                <span className="font-medium">Base Currency</span>
                <div className="flex flex-wrap gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBaseCurrency(c)}
                      className={`rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors ${
                        baseCurrency === c
                          ? "border-white text-white"
                          : "border-surface text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </label>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="rounded-sm border border-surface px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !portfolioName.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Portfolio"}
                  {!isSubmitting && <ChevronRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2 — Success */}
        {step === 2 && (
          <div className="text-center">
            <div className="mb-6 flex justify-center text-white">
              <CheckCircle size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-white">You're all set</h1>
            <p className="mt-3 text-sm text-neutral-400">
              <span className="font-semibold text-white">{createdName}</span> has been created.
              Start adding positions and tracking your returns.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push("/mainApp?view=dashboard")}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Go to Dashboard <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push("/mainApp/positions")}
                className="rounded-sm border border-surface px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Add my first position
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
