"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-slate-200"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 shadow-2xl md:shadow-none ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 md:p-6 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              💊 Evidenca zdravil
            </h1>
            <p className="text-xs md:text-sm text-slate-700 mt-1">
              Administracija
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-200 text-slate-900 bg-white border border-slate-300"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          <Link
            href="/admin"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            🏠 Pregled
          </Link>

          <Link
            href="/admin/add-medicine"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            💊 Zdravila
          </Link>

          <Link
            href="/admin/scan-stock"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📦 Dodaj zalogo
          </Link>

          <Link
            href="/admin/inventory"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📋 Zaloga
          </Link>

          <Link
            href="/admin/stock-summary"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📊 Skupna zaloga
          </Link>

          <Link
            href="/admin/transactions"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            📈 Poraba
          </Link>

          <Link
            href="/admin/orders"
            className="block px-3 md:px-4 py-3 md:py-3 rounded-xl hover:bg-slate-100 transition text-sm md:text-base text-slate-900 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            🛒 Naročilo
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
