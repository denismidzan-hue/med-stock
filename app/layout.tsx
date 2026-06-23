import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-blue-700 text-white shadow">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
            <h1 className="text-2xl font-bold">
              Evidenca zdravil
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
