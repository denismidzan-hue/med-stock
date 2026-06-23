"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Poraba zdravil"
        description="Evidenca porabe zdravil"
      />

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left p-4 font-semibold text-slate-700">
                Zdravilo
              </th>

              <th className="text-left p-4 font-semibold text-slate-700">
                Količina
              </th>

              <th className="text-left p-4 font-semibold text-slate-700">
                Tip
              </th>

              <th className="text-left p-4 font-semibold text-slate-700">
                Datum
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium text-slate-900">
                  {t.medicine_name}
                </td>

                <td className="p-4 text-slate-600">
                  {t.quantity}
                </td>

                <td className="p-4 text-slate-600">
                  {t.transaction_type}
                </td>

                <td className="p-4 text-slate-600">
                  {new Date(t.created_at).toLocaleString("sl-SI")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
