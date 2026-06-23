"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push("/admin");
    } else {
      setError("Napačno geslo");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full max-w-md shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
            alt="Arbor Mea"
            className="h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-900">Evidenca zdravil</h1>
          <p className="text-slate-500 mt-2">Vnesite geslo za vstop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Geslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Vnesite geslo"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Vstop
          </button>
        </form>
      </div>
    </div>
  );
}
