"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BarcodeScanner from "@/components/BarcodeScanner";
import { parseGS1 } from "@/lib/gs1";
import PageHeader from "@/components/PageHeader";

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

  async function findMedicineByCode(code: string) {
    alert("Iščem: " + code);

    const { data } = await supabase
      .from("medicines")
      .select("*")
      .eq("ean", code)
      .single();

    console.log(data);

    if (!data) {
      alert("Zdravilo ni najdeno");
      return;
    }

    alert("Najdeno: " + data.name);

    setEan(code);
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
      <PageHeader
        title="Dodaj zalogo"
        description="Skeniraj zdravilo in dodaj zalogo"
      />

      {!medicine ? (
        <>
          <input
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            placeholder="EAN"
            className="w-full h-14 px-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-slate-300 mb-6"
          />

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={findMedicine}
              className="h-14 rounded-2xl border border-slate-200 bg-white font-medium hover:bg-slate-50 transition"
            >
              Poišči zdravilo
            </button>

            <button
              onClick={() => setShowScanner(true)}
              className="h-14 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
            >
              📷 Skeniraj
            </button>
          </div>

          {showScanner && (
            <BarcodeScanner
              onScan={(code) => {
                const parsed = parseGS1(code);

                alert("GTIN: " + parsed.gtin);

                findMedicineByCode(parsed.gtin);

                if (parsed.lot) {
                  setBatchNumber(parsed.lot);
                }

                if (parsed.expiry.length === 6) {
                  const yy = parsed.expiry.slice(0, 2);
                  const mm = parsed.expiry.slice(2, 4);
                  const dd = parsed.expiry.slice(4, 6);

                  setExpiryDate(`20${yy}-${mm}-${dd}`);
                }

                setTimeout(() => {
                  setShowScanner(false);
                }, 500);
              }}
            />
          )}
        </>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <div className="text-sm text-slate-500">
              Najdeno zdravilo
            </div>
            <div className="text-3xl font-bold mt-2">
              💊 {medicine.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-xs uppercase text-slate-500 mb-1">
                Serija
              </div>
              <div className="font-semibold text-lg">
                {batchNumber}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-xs uppercase text-slate-500 mb-1">
                Rok uporabe
              </div>
              <div className="font-semibold text-lg">
                {expiryDate ? new Date(expiryDate).toLocaleDateString("sl-SI") : "-"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-3 font-medium">
              Količina
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                className="w-12 h-12 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                −
              </button>
              <div className="text-3xl font-bold w-20 text-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={saveBatch}
            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Shrani zalogo
          </button>
        </>
      )}
    </div>
  );
}
