"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BarcodeScanner from "@/components/BarcodeScanner";
import { parseGS1 } from "@/lib/gs1";
import PageHeader from "@/components/PageHeader";

export default function AddMedicinePage() {
  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [minStock, setMinStock] = useState(10);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

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
      <PageHeader
        title="Dodaj zdravilo"
        description="Dodaj novo zdravilo v evidenco"
      />

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <button
          onClick={() => setShowScanner(true)}
          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition mb-4"
        >
          📷 Skeniraj EAN / Data Matrix
        </button>

        <button
          onClick={() => setShowManualEntry(true)}
          className="w-full h-14 rounded-2xl border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 transition mb-6"
        >
          Vnesi ročno
        </button>

        {showScanner && (
          <div className="mb-6">
            <BarcodeScanner
              onScan={(code) => {
                const parsed = parseGS1(code);

                setEan(parsed.gtin || code);

                setShowScanner(false);
              }}
            />
          </div>
        )}

        {showManualEntry && (
          <div className="mb-6">
            <div className="mb-5">
              <label className="block mb-2 text-base font-medium text-slate-700">
                EAN koda
              </label>
              <input
                value={ean}
                onChange={(e) => setEan(e.target.value)}
                placeholder="1234567890123"
                className="w-full h-14 px-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 placeholder:opacity-40 outline-none focus:ring-2 focus:ring-slate-300 [-webkit-text-fill-color:#0f172a]"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-base font-medium text-slate-700">
                Naziv zdravila
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aspirin 100 mg"
                className="w-full h-14 px-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 placeholder:opacity-40 outline-none focus:ring-2 focus:ring-slate-300 [-webkit-text-fill-color:#0f172a]"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-3 text-base font-medium text-slate-700">
                Minimalna zaloga
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setMinStock(Math.max(1, minStock - 1))
                  }
                  className="w-12 h-12 rounded-xl border border-slate-300 text-slate-900 font-bold text-2xl bg-white"
                >
                  −
                </button>
                <div className="text-3xl font-bold text-slate-900 w-24 text-center">
                  {minStock}
                </div>
                <button
                  onClick={() =>
                    setMinStock(minStock + 1)
                  }
                  className="w-12 h-12 rounded-xl border border-slate-300 text-slate-900 font-bold text-2xl bg-white"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={saveMedicine}
              className="w-full h-14 rounded-2xl bg-slate-900 text-white font-semibold text-lg hover:bg-slate-800 transition"
            >
              Shrani zdravilo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
