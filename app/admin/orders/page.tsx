"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";

export default function OrdersPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data: medicines } = await supabase
      .from("medicines")
      .select("*");

    const { data: batches } = await supabase
      .from("batches")
      .select("*");

    if (!medicines || !batches) return;

    const lowStock = medicines
      .map((med) => {
        const stock = batches
          .filter((b) => b.medicine_id === med.id)
          .reduce((sum, b) => sum + b.quantity, 0);

        return {
          ...med,
          currentStock: stock,
        };
      })
      .filter(
        (med) => med.currentStock < med.min_stock
      );

    setItems(lowStock);
  }

  function exportOrderList() {
    const text = items
      .map(
        (i) =>
          `${i.name} | Zaloga: ${i.currentStock} | Minimum: ${i.min_stock}` 
      )
      .join("\n");

    navigator.clipboard.writeText(text);

    alert("Seznam kopiran v odložišče");
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Zdravila za naročilo"
        description="Upravljanje naročil zdravil"
      />

      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
        <div className="text-sm text-slate-500">
          Potrebno naročiti
        </div>
        <div className="text-4xl font-bold mt-2">
          {items.length}
        </div>
      </div>

      <button
        onClick={exportOrderList}
        className="h-12 px-6 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition mb-6"
      >
        Kopiraj seznam
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-left font-semibold text-slate-700">
                Zdravilo
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Zaloga
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Minimum
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Predlog
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="p-4 text-slate-600">
                  {item.currentStock}
                </td>
                <td className="p-4 text-slate-600">
                  {item.min_stock}
                </td>
                <td className="p-4">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Potrebno naročiti
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
