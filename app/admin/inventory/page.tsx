"use client";

import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "@/lib/supabase";
import { ArrowUp, ArrowDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function InventoryPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [showExpiringOnly, setShowExpiringOnly] =
    useState(false);
  const [search, setSearch] = useState("");
  const [editingBatch, setEditingBatch] =
    useState<any>(null);
  const [sortBy, setSortBy] = useState("expiry");
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");
  const [expandedMedicines, setExpandedMedicines] = useState<Set<string>>(new Set());

  async function loadInventory() {
    const { data: batchesData, error } = await supabase
      .from("batches")
      .select("*")
      .order("expiry_date");

    if (error) {
      console.log(error);
      return;
    }

    const { data: medicinesData } = await supabase
      .from("medicines")
      .select("*");

    setBatches(batchesData || []);
    setMedicines(medicinesData || []);
  }

  useEffect(() => {
    loadInventory();
  }, []);

  function toggleMedicine(medicineId: string) {
    const newExpanded = new Set(expandedMedicines);
    if (newExpanded.has(medicineId)) {
      newExpanded.delete(medicineId);
    } else {
      newExpanded.add(medicineId);
    }
    setExpandedMedicines(newExpanded);
  }

  function getMedicineImage(medicineId: string) {
    const medicine = medicines.find(m => m.id === medicineId);
    return medicine?.image_url || null;
  }

  function getStatusBadge(expiryDate: string) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 30) {
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
          Poteka
        </span>
      );
    }
    if (diff < 90) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          Nizka zaloga
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        Na zalogi
      </span>
    );
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

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
    <div className="p-4 md:p-8">
      <PageHeader
        title="Zaloga zdravil"
        description="Pregled vseh serij in rokov uporabe"
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Išči zdravilo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 placeholder:opacity-70 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="mb-4">
        <label className="flex gap-2 items-center text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={showExpiringOnly}
            onChange={(e) =>
              setShowExpiringOnly(e.target.checked)
            }
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Prikaži samo zdravila pred potekom
        </label>
      </div>

      {editingBatch && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <h2 className="font-bold mb-3 text-lg">
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
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={saveBatchChanges}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
          >
            Shrani
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full table-auto table-fixed">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left w-1/4">Zdravilo</th>
              <th className="p-4 text-left w-1/6">Serija</th>
              <th
                onClick={() => handleSort("quantity")}
                className="p-4 text-left cursor-pointer select-none hover:text-slate-900 w-1/6"
              >
                <div className="flex items-center gap-1">
                  Količina
                  {sortBy === "quantity" && (
                    sortDirection === "asc" ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("expiry")}
                className="p-4 text-left cursor-pointer select-none hover:text-slate-900 w-1/6"
              >
                <div className="flex items-center gap-1">
                  Rok uporabe
                  {sortBy === "expiry" && (
                    sortDirection === "asc" ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )
                  )}
                </div>
              </th>
              <th className="p-4 text-left w-1/6">Status</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>

          <tbody>
            {(() => {
              // Group batches by medicine_id
              const groupedBatches = batches.reduce((acc: Record<string, any[]>, batch: any) => {
                if (!acc[batch.medicine_id]) {
                  acc[batch.medicine_id] = [];
                }
                acc[batch.medicine_id].push(batch);
                return acc;
              }, {} as Record<string, any[]>);

              // Convert to array and filter/sort
              const groupedArray = Object.entries(groupedBatches)
                .filter(([medicineId, batchList]: [string, any[]]) => {
                  const medicineName = batchList[0]?.medicine_name?.toLowerCase() || "";
                  const query = search.toLowerCase();
                  const matchesSearch = medicineName.includes(query);
                  if (!matchesSearch) return false;

                  if (!showExpiringOnly) return true;

                  return batchList.some((batch: any) => {
                    const expiry = new Date(batch.expiry_date);
                    const today = new Date();
                    const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                    return diff < 90;
                  });
                })
                .sort(([, a]: [string, any[]], [, b]: [string, any[]]) => {
                  const totalA = a.reduce((sum: number, batch: any) => sum + batch.quantity, 0);
                  const totalB = b.reduce((sum: number, batch: any) => sum + batch.quantity, 0);
                  return sortDirection === "asc" ? totalA - totalB : totalB - totalA;
                });

              return groupedArray.map(([medicineId, batchList]: [string, any[]]) => {
                const isExpanded = expandedMedicines.has(medicineId);
                const totalQuantity = batchList.reduce((sum: number, batch: any) => sum + batch.quantity, 0);
                const earliestExpiry = batchList.reduce((earliest: Date | null, batch: any) => {
                  const expiry = new Date(batch.expiry_date);
                  return !earliest || expiry < earliest ? expiry : earliest;
                }, null as Date | null);

                // Count unique batches by batch number and expiry date
                const uniqueBatches = new Set(batchList.map((batch: any) => `${batch.batch_number}_${batch.expiry_date}`)).size;

                return (
                  <React.Fragment key={medicineId}>
                    <tr
                      onClick={() => toggleMedicine(medicineId)}
                      className="border-b hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {getMedicineImage(medicineId) ? (
                            <img
                              src={getMedicineImage(medicineId)}
                              className="w-14 h-14 rounded-xl object-cover border"
                              alt={batchList[0].medicine_name}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                              💊
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900">
                              {batchList[0].medicine_name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {uniqueBatches} serij
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {isExpanded ? "▼" : "-"}
                      </td>

                      <td className="p-4 font-medium">
                        {totalQuantity}
                      </td>

                      <td className="p-4">
                        {isExpanded ? "▼" : (earliestExpiry ? earliestExpiry.toLocaleDateString("sl-SI") : "-")}
                      </td>

                      <td className="p-4">
                        {isExpanded ? "▼" : (earliestExpiry ? getStatusBadge(earliestExpiry.toISOString()) : "-")}
                      </td>

                      <td className="p-4">
                        {isExpanded ? "▼" : "▶"}
                      </td>
                    </tr>

                    {isExpanded && (() => {
                      // Group batches by batch number and expiry date
                      const groupedByBatch = batchList.reduce((acc: Record<string, any[]>, batch: any) => {
                        const key = `${batch.batch_number}_${batch.expiry_date}`;
                        if (!acc[key]) {
                          acc[key] = [];
                        }
                        acc[key].push(batch);
                        return acc;
                      }, {});

                      return Object.entries(groupedByBatch).map(([key, batches]: [string, any[]]) => {
                        const totalQuantity = batches.reduce((sum: number, b: any) => sum + b.quantity, 0);
                        const firstBatch = batches[0];

                        return (
                          <tr
                            key={key}
                            className="border-b bg-slate-50 hover:bg-slate-100 transition"
                          >
                            <td className="p-4 pl-12">
                              <div className="text-sm text-slate-600">
                                {firstBatch.medicine_name} {firstBatch.batch_number}
                              </div>
                            </td>

                            <td className="p-4">
                              {firstBatch.batch_number}
                            </td>

                            <td className="p-4 font-medium">
                              {totalQuantity}
                            </td>

                            <td className="p-4">
                              {new Date(firstBatch.expiry_date).toLocaleDateString("sl-SI")}
                            </td>

                            <td className="p-4">
                              {getStatusBadge(firstBatch.expiry_date)}
                            </td>

                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editBatch(firstBatch);
                                  }}
                                  className="text-slate-500 hover:text-slate-900"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBatch(firstBatch.id);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </React.Fragment>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
