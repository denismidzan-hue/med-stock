"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Pill,
  Package,
  AlertTriangle,
  CalendarClock
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
              alt="Arbor Mea"
              className="h-20 w-auto"
            />
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              EVIDENCA ZDRAVIL
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 p-6 transform transition-transform">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
          <nav className="mt-8 space-y-4">
            <Link
              href="/admin/scan-stock"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              � Dodaj zalogo
            </Link>
            <Link
              href="/admin/add-medicine"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              � Dodaj zdravilo
            </Link>
            <Link
              href="/admin/inventory"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              � Zaloga
            </Link>
            <Link
              href="/admin/transactions"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              � Poraba
            </Link>
            <Link
              href="/admin/orders"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              � Naročilo
            </Link>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Pill className="w-6 h-6 md:w-8 md:h-8" />
              <div className="text-xs md:text-sm text-slate-500">
                Skupno zdravil
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900">
              {totalMedicines}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Package className="w-6 h-6 md:w-8 md:h-8" />
              <div className="text-xs md:text-sm text-slate-500">
                Skupna zaloga
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900">
              {totalStock}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
              <div className="text-xs md:text-sm text-slate-500">
                Pod minimumom
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900">
              {lowStock.length}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CalendarClock className="w-6 h-6 md:w-8 md:h-8" />
              <div className="text-xs md:text-sm text-slate-500">
                Pred potekom
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900">
              {expiring.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/add-medicine"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">�</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Dodaj zdravilo
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Novo zdravilo v bazo
            </div>
          </Link>

          <Link
            href="/admin/scan-stock"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">📦</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Dodaj zalogo
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Skeniraj Data Matrix
            </div>
          </Link>

          <Link
            href="/admin/inventory"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">�</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Zaloga
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Pregled serij
            </div>
          </Link>

          <Link
            href="/admin/transactions"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">�</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Poraba
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Zgodovina porabe
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">�</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Naročilo
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Upravljanje naročil
            </div>
          </Link>

          <Link
            href="/admin/stock-summary"
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-2xl md:text-3xl mb-2 md:mb-4">�</div>
            <div className="font-semibold text-slate-900 text-sm md:text-base">
              Skupna zaloga
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              Pregled zaloge
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          <div className="bg-white border rounded-xl p-4 md:p-5 shadow">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
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

          <div className="bg-white border rounded-xl p-4 md:p-5 shadow">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
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
      </main>
    </div>
  );
}
