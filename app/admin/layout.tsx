"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

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
        <div className="border-b border-slate-200 relative">
          {/* Mobile */}
          <div className="flex md:hidden justify-center py-4">
            <img
              src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
              alt="Arbor Mea"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop */}
          <div className="hidden md:flex flex-col items-center py-6">
            <img
              src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
              alt="Arbor Mea"
              className="h-16 w-auto"
            />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
              Evidenca zdravil
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-200 text-slate-900 bg-white border border-slate-300"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          <Link
            href="/admin"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            🏠 Pregled
          </Link>

          <Link
            href="/admin/add-medicine"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/add-medicine') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            💊 Zdravila
          </Link>

          <Link
            href="/admin/scan-stock"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/scan-stock') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📦 Dodaj zalogo
          </Link>

          <Link
            href="/admin/inventory"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/inventory') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📋 Zaloga
          </Link>

          <Link
            href="/admin/stock-summary"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/stock-summary') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📊 Skupna zaloga
          </Link>

          <Link
            href="/admin/transactions"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/transactions') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📈 Poraba
          </Link>

          <Link
            href="/admin/orders"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin/orders') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
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
