"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function ScanStockPage() {
  const [ean, setEan] = useState("");
  const [medicine, setMedicine] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  async function findMedicine() {
    const { data } = await supabase
      .from("medicines")
      .select("*")
      .eq("ean", ean)
      .single();

    if (!data) {
      alert("Zdravilo ni najdeno");
      return;
    }

    setMedicine(data);
  }

  async function saveBatch() {
    const { error } = await supabase
      .from("batches")
      .insert([
        {
          medicine_id: medicine.id,
          medicine_name: medicine.name,
          batch_number: batchNumber,
          expiry_date: expiryDate,
          quantity: quantity,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Zaloga dodana");

    setMedicine(null);
    setEan("");
    setQuantity(1);
    setBatchNumber("");
    setExpiryDate("");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Dodaj zalogo
      </h1>

      {!medicine ? (
        <>
          <input
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            placeholder="EAN"
            className="border p-2 w-full mb-4"
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={findMedicine}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Poišči zdravilo
            </button>

            <button
              onClick={() => setShowScanner(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              📷 Skeniraj
            </button>
          </div>

          {showScanner && (
            <div className="mb-4">
              <BarcodeScanner
                onScan={(code) => {
                  setEan(code);
                  setShowScanner(false);

                  setTimeout(() => {
                    findMedicine();
                  }, 300);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {medicine.name}
          </h2>

          <input
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Serija"
            className="border p-2 w-full mb-4"
          />

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border p-2 w-full mb-4"
          />

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="border p-2 w-full mb-4"
          />

          <button
            onClick={saveBatch}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Shrani zalogo
          </button>
        </>
      )}
    </div>
  );
}
