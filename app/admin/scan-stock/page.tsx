"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BarcodeScanner from "@/components/BarcodeScanner";
import { parseGS1 } from "@/lib/gs1";
import PageHeader from "@/components/PageHeader";

export default function ScanStockPage() {
  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [medicine, setMedicine] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  async function findMedicine() {
    let data;
    if (name) {
      const { data: nameData } = await supabase
        .from("medicines")
        .select("*")
        .ilike("name", `%${name}%`)
        .limit(1);

      if (!nameData || nameData.length === 0) {
        alert("Zdravilo ni najdeno");
        return;
      }
      data = nameData[0];
    } else if (ean) {
      const { data: eanData } = await supabase
        .from("medicines")
        .select("*")
        .eq("ean", ean)
        .single();

      if (!eanData) {
        alert("Zdravilo ni najdeno");
        return;
      }
      data = eanData;
    } else {
      alert("Vnesite EAN ali ime zdravila");
      return;
    }

    setMedicine(data);
  }

  async function findMedicineByCode(code: string) {
    const { data } = await supabase
      .from("medicines")
      .select("*")
      .eq("ean", code)
      .single();

    if (!data) {
      alert("Zdravilo ni najdeno");
      return;
    }

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
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setShowScanner(true)}
              className="h-14 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
            >
              📷 Skeniraj
            </button>

            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="h-14 rounded-2xl border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 transition"
            >
              Poišči ročno
            </button>
          </div>

          {showScanner && (
            <div className="mb-6">
              <BarcodeScanner
                onScan={(code) => {
                  const parsed = parseGS1(code);

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
            </div>
          )}

          {showManualEntry && (
            <div className="mb-6 bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Ročno iskanje</h3>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ime zdravila"
                className="w-full h-14 px-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 placeholder:opacity-40 outline-none focus:ring-2 focus:ring-slate-300 mb-4 [-webkit-text-fill-color:#0f172a]"
              />

              <input
                value={ean}
                onChange={(e) => setEan(e.target.value)}
                placeholder="EAN"
                className="w-full h-14 px-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 placeholder:opacity-40 outline-none focus:ring-2 focus:ring-slate-300 mb-6 [-webkit-text-fill-color:#0f172a]"
              />

              <button
                onClick={findMedicine}
                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
              >
                Poišči zdravilo
              </button>
            </div>
          )}

          {showScanner && (
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="w-full h-14 rounded-2xl border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 transition"
            >
              Poišči ročno
            </button>
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
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Serija
              </label>
              <input
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Vnesi serijo"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 placeholder:opacity-40 outline-none focus:ring-2 focus:ring-slate-300 [-webkit-text-fill-color:#0f172a]"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Rok uporabe
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 [-webkit-text-fill-color:#0f172a]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-base font-medium text-slate-900">
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
              <div className="text-3xl font-bold w-20 text-center text-slate-900">
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
