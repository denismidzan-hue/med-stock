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
        <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Pill size={32} />
            <div className="text-sm opacity-80">
              Skupno zdravil
            </div>
          </div>
          <div className="text-3xl font-bold">
            {totalMedicines}
          </div>
        </div>

        <div className="bg-green-600 text-white rounded-xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Package size={32} />
            <div className="text-sm opacity-80">
              Skupna zaloga
            </div>
          </div>
          <div className="text-3xl font-bold">
            {totalStock}
          </div>
        </div>

        <div className="bg-red-600 text-white rounded-xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={32} />
            <div className="text-sm opacity-80">
              Pod minimumom
            </div>
          </div>
          <div className="text-3xl font-bold">
            {lowStock.length}
          </div>
        </div>

        <div className="bg-yellow-500 text-white rounded-xl p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock size={32} />
            <div className="text-sm opacity-80">
              Pred potekom
            </div>
          </div>
          <div className="text-3xl font-bold">
            {expiring.length}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/add-medicine"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition duration-300"
        >
          <div className="text-3xl mb-2">💊</div>
          <div className="font-bold text-lg">
            Dodaj zdravilo
          </div>
          <div className="text-sm opacity-90">
            Novo zdravilo v bazo
          </div>
        </Link>

        <Link
          href="/admin/scan-stock"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📦</div>
          <div className="font-bold text-lg">
            Dodaj zalogo
          </div>
          <div className="text-sm opacity-90">
            Skeniraj Data Matrix
          </div>
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📋</div>
          <div className="font-bold text-lg">
            Zaloga
          </div>
          <div className="text-sm opacity-90">
            Pregled serij
          </div>
        </Link>

        <Link
          href="/admin/transactions"
          className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="font-bold text-lg">
            Poraba
          </div>
          <div className="text-sm opacity-90">
            Zgodovina porabe
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-lg">
            Naročilo
          </div>
          <div className="text-sm opacity-90">
            Upravljanje naročil
          </div>
        </Link>

        <Link
          href="/admin/stock-summary"
          className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📈</div>
          <div className="font-bold text-lg">
            Skupna zaloga
          </div>
          <div className="text-sm opacity-90">
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
