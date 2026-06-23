"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

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
    <div className="h-screen w-screen bg-slate-100 flex items-center justify-center p-4 overflow-hidden fixed inset-0">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full max-w-md shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
            alt="Arbor Mea"
            className="h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-900 text-center">Evidenca zdravil</h1>
          <p className="text-slate-700 mt-2 text-center text-base">Vnesite geslo za vstop</p>
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
