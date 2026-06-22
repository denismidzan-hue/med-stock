import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Link
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Prijava v sistem
      </Link>
    </main>
  );
}
