"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);

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

      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/add-medicine"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Dodaj zdravilo
        </Link>

        <Link
          href="/admin/scan-stock"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Dodaj zalogo
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Zaloga
        </Link>

        <Link
          href="/admin/transactions"
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Poraba
        </Link>

        <Link
          href="/admin/orders"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Naročilo
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="border rounded p-4">
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

        <div className="border rounded p-4">
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
