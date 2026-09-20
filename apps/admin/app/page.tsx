import Link from "next/link";

export default function AdminHomePage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#090b12] p-6 text-center text-white"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nexus AI Admin</p><h1 className="mt-3 text-2xl font-bold">Operations console</h1><Link href="/dashboard" className="mt-6 inline-block rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500">Open dashboard</Link></div></main>;
}
