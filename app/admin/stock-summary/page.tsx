"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";

export default function StockSummaryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: medicines } = await supabase
      .from("medicines")
      .select("*");

    const { data: batches } = await supabase
      .from("batches")
      .select("*");

    if (!medicines || !batches) return;

    const summary = medicines.map((med) => {
      const stock = batches
        .filter((b) => b.medicine_id === med.id)
        .reduce((sum, b) => sum + b.quantity, 0);

      return {
        id: med.id,
        name: med.name,
        stock,
        min_stock: med.min_stock,
      };
    });

    setItems(summary);
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Skupna zaloga"
        description="Pregled skupne zaloge vseh zdravil"
      />

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2 text-left">
              Zdravilo
            </th>
            <th className="p-2 text-left">
              Zaloga
            </th>
            <th className="p-2 text-left">
              Minimum
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={
                item.stock < item.min_stock
                  ? "bg-red-100"
                  : ""
              }
            >
              <td className="p-2">
                {item.name}
              </td>

              <td className="p-2">
                {item.stock}
              </td>

              <td className="p-2">
                {item.min_stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
