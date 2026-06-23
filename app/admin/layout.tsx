"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
              alt="Arbor Mea"
              className="h-14 w-auto"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              EVIDENCA ZDRAVIL
            </p>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col inset-y-0 left-0 w-72 bg-white border-r border-slate-200">
        <div className="border-b border-slate-200">
          <Link href="/admin" className="flex flex-col items-center py-6">
            <img
              src="https://arbormea.com/wp-content/themes/arbor/images/logo.svg"
              alt="Arbor Mea"
              className="h-16 w-auto"
            />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
              Evidenca zdravil
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          <Link
            href="/admin"
            className={`block px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium ${
              isActive('/admin') 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
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
          >
            🛒 Naročilo
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 md:px-4 py-3 md:py-3 rounded-xl transition text-sm md:text-base font-medium text-red-600 hover:bg-red-50"
          >
            🚪 Odjava
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
