"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Zdravila za naročilo
      </h1>

      <button
        onClick={exportOrderList}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Kopiraj seznam
      </button>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2">Zdravilo</th>
            <th className="p-2">Zaloga</th>
            <th className="p-2">Minimum</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.currentStock}</td>
              <td className="p-2">{item.min_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
