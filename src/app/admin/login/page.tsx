"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to login");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-cyan-400">
            Anmol.OS
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Admin Access
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Authenticate to manage portfolio content.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50"
              >
                Email
              </label>

              <div className="flex items-center border border-white/10 bg-black/30 px-4 transition focus-within:border-cyan-400/50">
                <Mail
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50"
              >
                Password
              </label>

              <div className="flex items-center border border-white/10 bg-black/30 px-4 transition focus-within:border-cyan-400/50">
                <LockKeyhole
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {error && (
              <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-cyan-400/30 bg-cyan-400 px-5 py-4 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Enter Dashboard"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-white/25">
          Restricted administrative environment
        </p>
      </section>
    </main>
  );
}