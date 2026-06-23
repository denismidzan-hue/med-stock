import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-slate-900">
            💊 Evidenca zdravil
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Administracija
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            🏠 Pregled
          </Link>

          <Link
            href="/admin/add-medicine"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            💊 Zdravila
          </Link>

          <Link
            href="/admin/scan-stock"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            📦 Dodaj zalogo
          </Link>

          <Link
            href="/admin/inventory"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            📋 Zaloga
          </Link>

          <Link
            href="/admin/stock-summary"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            📊 Skupna zaloga
          </Link>

          <Link
            href="/admin/transactions"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            📈 Poraba
          </Link>

          <Link
            href="/admin/orders"
            className="block px-4 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            🛒 Naročilo
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
