"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeePage() {
  const [lastScan, setLastScan] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function consumeByEan(code: string) {
    const { data: medicine } = await supabase
      .from("medicines")
      .select("*")
      .eq("ean", code)
      .single();

    if (!medicine) {
      setStatus("error");
      setLastScan("❌ Zdravilo ni najdeno");

      setTimeout(() => {
        setStatus(null);
        setLastScan("");
      }, 3000);
      return;
    }

    const { data: batches } = await supabase
      .from("batches")
      .select("*")
      .eq("medicine_id", medicine.id)
      .gt("quantity", 0)
      .order("expiry_date", { ascending: true });

    if (!batches?.length) {
      setStatus("error");
      setLastScan("❌ Ni zaloge");

      setTimeout(() => {
        setStatus(null);
        setLastScan("");
      }, 3000);
      return;
    }

    const batch = batches[0];

    await supabase
      .from("batches")
      .update({
        quantity: batch.quantity - 1,
      })
      .eq("id", batch.id);

    await supabase.from("transactions").insert([
      {
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        quantity: 1,
        transaction_type: "consume",
      },
    ]);

    setStatus("success");
    setLastScan(
      `✓ ${medicine.name} - poraba zabeležena` 
    );

    setTimeout(() => {
      setStatus(null);
      setLastScan("");
    }, 3000);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        💊 Poraba zdravil
      </h1>

      <input
        autoFocus
        placeholder="Skeniraj zdravilo"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            consumeByEan(
              (e.target as HTMLInputElement).value
            );

            (e.target as HTMLInputElement).value = "";
          }
        }}
        className="border p-4 w-full text-2xl rounded-xl"
      />

      <div
        className={`
          mt-6
          p-6
          rounded-xl
          text-center
          text-3xl
          font-bold
          ${
            status === "success"
              ? "bg-green-100 text-green-700"
              : status === "error"
              ? "bg-red-100 text-red-700"
              : ""
          }
        `}
      >
        {lastScan}
      </div>
    </div>
  );
}
