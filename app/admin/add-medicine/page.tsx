"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function AddMedicinePage() {
  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [minStock, setMinStock] = useState(10);
  const [showScanner, setShowScanner] = useState(false);

  async function saveMedicine() {
    const { error } = await supabase
      .from("medicines")
      .insert([
        {
          ean,
          name,
          min_stock: minStock,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Zdravilo uspešno dodano");

    setEan("");
    setName("");
    setMinStock(10);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Dodaj novo zdravilo
      </h1>

      <button
        onClick={() => setShowScanner(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        📷 Skeniraj EAN
      </button>

      {showScanner && (
        <div className="mb-4">
          <BarcodeScanner
            onScan={(code) => {
              setEan(code);
              setShowScanner(false);
            }}
          />
        </div>
      )}

      <input
        value={ean}
        onChange={(e) => setEan(e.target.value)}
        placeholder="EAN koda"
        className="border p-2 w-full mb-4"
      />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Naziv zdravila"
        className="border p-2 w-full mb-4"
      />

      <input
        type="number"
        value={minStock}
        onChange={(e) => setMinStock(Number(e.target.value))}
        placeholder="Minimalna zaloga"
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={saveMedicine}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Shrani zdravilo
      </button>
    </div>
  );
}
