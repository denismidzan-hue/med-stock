"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
            alt="Arbor Mea"
            className="h-12 w-auto"
          />
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
              href="/admin"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Pregled
            </Link>
            <Link
              href="/admin/scan-stock"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 Dodaj zalogo
            </Link>
            <Link
              href="/admin/add-medicine"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              💊 Dodaj zdravilo
            </Link>
            <Link
              href="/admin/inventory"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              📋 Zaloga
            </Link>
            <Link
              href="/admin/transactions"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              📈 Poraba
            </Link>
            <Link
              href="/admin/orders"
              className="block py-3 px-4 rounded-xl hover:bg-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              🛒 Naročilo
            </Link>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Evidenca zdravil
          </h1>
          <p className="text-slate-500">
            Sistem za upravljanje zaloge zdravil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Pregled
            </h2>
            <p className="text-slate-500">
              Pregled stanja zaloge in aktivnosti
            </p>
          </Link>

          <Link
            href="/admin/scan-stock"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Dodaj zalogo
            </h2>
            <p className="text-slate-500">
              Skeniraj zdravilo in dodaj zalogo
            </p>
          </Link>

          <Link
            href="/admin/add-medicine"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">💊</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Dodaj zdravilo
            </h2>
            <p className="text-slate-500">
              Dodaj novo zdravilo v evidenco
            </p>
          </Link>

          <Link
            href="/admin/inventory"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Zaloga
            </h2>
            <p className="text-slate-500">
              Pregled vseh serij in rokov uporabe
            </p>
          </Link>

          <Link
            href="/admin/transactions"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Poraba
            </h2>
            <p className="text-slate-500">
              Evidenca porabe zdravil
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Naročilo
            </h2>
            <p className="text-slate-500">
              Upravljanje naročil zdravil
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
