"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InventoryPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [showExpiringOnly, setShowExpiringOnly] =
    useState(false);
  const [search, setSearch] = useState("");
  const [editingBatch, setEditingBatch] =
    useState<any>(null);

  async function loadInventory() {
    const { data, error } = await supabase
      .from("batches")
      .select("*")
      .order("expiry_date");

    if (error) {
      console.log(error);
      return;
    }

    setBatches(data || []);
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function deleteBatch(id: string) {
    const { data: batch } = await supabase
      .from("batches")
      .select("*")
      .eq("id", id)
      .single();

    if (!batch) return;

    const ok = confirm(
      "Ali res želiš izbrisati serijo?"
    );

    if (!ok) return;

    await supabase.from("audit_logs").insert([
      {
        action: "DELETE_BATCH",
        medicine_name: batch.medicine_name,
        details: `Serija ${batch.batch_number}`,
      },
    ]);

    const { error } = await supabase
      .from("batches")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadInventory();
  }

  function editBatch(batch: any) {
    setEditingBatch(batch);
  }

  async function saveBatchChanges() {
    const { error } = await supabase
      .from("batches")
      .update({
        batch_number:
          editingBatch.batch_number,
        expiry_date:
          editingBatch.expiry_date,
        quantity: editingBatch.quantity,
      })
      .eq("id", editingBatch.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("audit_logs").insert([
      {
        action: "UPDATE_BATCH",
        medicine_name: editingBatch.medicine_name,
        details: `Kolicina: ${editingBatch.quantity}`,
      },
    ]);

    setEditingBatch(null);

    loadInventory();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Zaloga zdravil
      </h1>

      <input
        type="text"
        placeholder="Išči zdravilo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      {editingBatch && (
        <div className="border p-4 rounded mb-6">
          <h2 className="font-bold mb-3">
            Uredi serijo
          </h2>

          <input
            value={editingBatch.batch_number}
            onChange={(e) =>
              setEditingBatch({
                ...editingBatch,
                batch_number: e.target.value,
              })
            }
            className="border p-2 w-full mb-2"
          />

          <input
            type="date"
            value={editingBatch.expiry_date}
            onChange={(e) =>
              setEditingBatch({
                ...editingBatch,
                expiry_date: e.target.value,
              })
            }
            className="border p-2 w-full mb-2"
          />

          <input
            type="number"
            value={editingBatch.quantity}
            onChange={(e) =>
              setEditingBatch({
                ...editingBatch,
                quantity: Number(e.target.value),
              })
            }
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={saveBatchChanges}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Shrani
          </button>
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Zdravilo</th>
            <th className="text-left p-2">Serija</th>
            <th className="text-left p-2">Rok</th>
            <th className="text-left p-2">Količina</th>
            <th className="text-left p-2">
              Akcije
            </th>
          </tr>
        </thead>

        <div className="mb-4">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={showExpiringOnly}
              onChange={(e) =>
                setShowExpiringOnly(e.target.checked)
              }
            />

            Prikaži samo zdravila pred potekom
          </label>
        </div>

        <tbody>
          {batches
            .filter((batch) => {
              const medicineName =
                batch.medicine_name?.toLowerCase() || "";

              const batchNumber =
                batch.batch_number?.toLowerCase() || "";

              const query = search.toLowerCase();

              const matchesSearch =
                medicineName.includes(query) ||
                batchNumber.includes(query);

              if (!matchesSearch) return false;

              if (!showExpiringOnly) return true;

              const expiry = new Date(batch.expiry_date);
              const today = new Date();

              const diff =
                (expiry.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24);

              return diff < 90;
            })
            .map((batch) => (
            <tr
              key={batch.id}
              className={`border-b ${
                (() => {
                  const expiry = new Date(batch.expiry_date);
                  const today = new Date();

                  const diff =
                    (expiry.getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24);

                  if (diff < 30) return "bg-red-200";
                  if (diff < 90) return "bg-yellow-100";

                  return "";
                })()
              }`}
            >
              <td className="p-2">
                {batch.medicine_name}
              </td>

              <td className="p-2">
                {batch.batch_number}
              </td>

              <td className="p-2">
                {batch.expiry_date}
              </td>

              <td className="p-2">
                {batch.quantity}
              </td>

              <td className="p-2 flex gap-2">
                <button
                  onClick={() => editBatch(batch)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteBatch(batch.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
