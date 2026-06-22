"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeePage() {
  const [ean, setEan] = useState("");
  const [medicine, setMedicine] = useState<any>(null);
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

  async function findMedicine() {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("ean", ean)
      .single();

    if (error || !data) {
      alert("Zdravilo ni najdeno");
      return;
    }

    const { data: batches } = await supabase
      .from("batches")
      .select("*")
      .eq("medicine_id", data.id)
      .gt("quantity", 0)
      .order("expiry_date", { ascending: true });

    const totalStock =
      batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;

    setMedicine({
      ...data,
      totalStock,
      batches,
    });
  }

  async function consumeOne() {
    if (!medicine?.batches?.length) {
      alert("Ni zaloge");
      return;
    }

    const batch = medicine.batches[0];

    const { error } = await supabase
      .from("batches")
      .update({
        quantity: batch.quantity - 1,
      })
      .eq("id", batch.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Poraba zabeležena");

    setMedicine(null);
    setEan("");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Poraba zdravila
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
        className="border p-4 w-full text-2xl"
      />

      <div
        className={`
          mt-6
          p-6
          rounded
          text-center
          text-3xl
          font-bold
          ${
            status === "success"
              ? "bg-green-200"
              : status === "error"
              ? "bg-red-200"
              : ""
          }
        `}
      >
        {lastScan}
      </div>

      {!medicine ? (
        <>
          <input
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            placeholder="EAN koda"
            className="border p-2 w-full mb-4"
          />

          <button
            onClick={findMedicine}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Poišči zdravilo
          </button>
        </>
      ) : (
        <>
          <div className="border rounded p-4">
            <h2 className="text-xl font-bold">
              {medicine.name}
            </h2>

            <p className="mt-2">
              Zaloga: {medicine.totalStock}
            </p>

            <button
              onClick={consumeOne}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Porabi 1
            </button>
          </div>
        </>
      )}
    </div>
  );
}
