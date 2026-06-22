"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user.id;

    console.log("USER ID:", userId);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("PROFILE:", profile);
    console.log("PROFILE ERROR:", profileError);

    if (!profile) {
      alert("Profil ne obstaja");
      return;
    }

    if (profile.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/employee";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[350px] space-y-4">
        <h1 className="text-2xl font-bold">
          Prijava
        </h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Prijava
        </button>
      </div>
    </div>
  );
}
