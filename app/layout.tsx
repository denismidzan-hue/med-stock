import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evidenca zdravil",
  description: "Sistem za evidenco zdravil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-100">
        <header className="bg-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                💊 Evidenca zdravil
              </h1>

              <p className="text-sm text-blue-100">
                Operacijski blok
              </p>
            </div>

            <nav className="flex gap-3">
              <Link
                href="/admin"
                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg"
              >
                Dashboard
              </Link>

              <Link
                href="/admin/inventory"
                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg"
              >
                Zaloga
              </Link>

              <Link
                href="/admin/stock-summary"
                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg"
              >
                Skupna zaloga
              </Link>

              <Link
                href="/employee"
                className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg"
              >
                Poraba
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
