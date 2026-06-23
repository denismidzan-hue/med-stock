"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Pill,
  Package,
  AlertTriangle,
  CalendarClock
} from "lucide-react";

export default function AdminPage() {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: batches } = await supabase
      .from("batches")
      .select("*");

    if (!batches) return;

    const today = new Date();

    const expiringBatches = batches.filter((batch) => {
      const expiry = new Date(batch.expiry_date);

      const diff =
        (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

      return diff <= 30;
    });

    setExpiring(expiringBatches);

    const { data: medicines } = await supabase
      .from("medicines")
      .select("*");

    if (!medicines) return;

    setTotalMedicines(medicines.length);

    const stockCount = batches.reduce(
      (sum, b) => sum + b.quantity,
      0
    );

    setTotalStock(stockCount);

    const low = medicines.filter((med) => {
      const stock = batches
        .filter((b) => b.medicine_id === med.id)
        .reduce((sum, b) => sum + b.quantity, 0);

      return stock < med.min_stock;
    });

    setLowStock(low);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Pill size={32} className="text-blue-600" />
            <div className="text-sm text-slate-500">
              Skupno zdravil
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalMedicines}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Package size={32} className="text-green-600" />
            <div className="text-sm text-slate-500">
              Skupna zaloga
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalStock}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={32} className="text-red-600" />
            <div className="text-sm text-slate-500">
              Pod minimumom
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {lowStock.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock size={32} className="text-yellow-600" />
            <div className="text-sm text-slate-500">
              Pred potekom
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {expiring.length}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/add-medicine"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">💊</div>
          <div className="font-semibold text-slate-900">
            Dodaj zdravilo
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Novo zdravilo v bazo
          </div>
        </Link>

        <Link
          href="/admin/scan-stock"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">📦</div>
          <div className="font-semibold text-slate-900">
            Dodaj zalogo
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Skeniraj Data Matrix
          </div>
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">📋</div>
          <div className="font-semibold text-slate-900">
            Zaloga
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Pregled serij
          </div>
        </Link>

        <Link
          href="/admin/transactions"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">📊</div>
          <div className="font-semibold text-slate-900">
            Poraba
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Zgodovina porabe
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">📝</div>
          <div className="font-semibold text-slate-900">
            Naročilo
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Upravljanje naročil
          </div>
        </Link>

        <Link
          href="/admin/stock-summary"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        >
          <div className="text-3xl mb-4">📈</div>
          <div className="font-semibold text-slate-900">
            Skupna zaloga
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Pregled zaloge
          </div>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white border rounded-xl p-5 shadow">
          <h2 className="text-xl font-bold text-red-600 mb-3">
            Nizka zaloga
          </h2>

          {lowStock.length === 0 ? (
            <p>Ni opozoril</p>
          ) : (
            lowStock.map((item) => (
              <div
                key={item.id}
                className="border-b py-2"
              >
                {item.name}
              </div>
            ))
          )}
        </div>

        <div className="bg-white border rounded-xl p-5 shadow">
          <h2 className="text-xl font-bold text-yellow-600 mb-3">
            Rok uporabe &lt; 30 dni
          </h2>

          {expiring.length === 0 ? (
            <p>Ni opozoril</p>
          ) : (
            expiring.map((item) => (
              <div
                key={item.id}
                className="border-b py-2"
              >
                {item.medicine_name}
                <br />
                Rok: {item.expiry_date}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
