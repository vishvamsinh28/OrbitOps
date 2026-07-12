import Link from "next/link";
import { connectDB } from "@/lib/db";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  await connectDB();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="relative w-full max-w-[440px] rounded-[8px] border border-[rgba(148,168,210,0.18)] bg-[#111725] p-6">
        <Link
          href="/"
          aria-label="Close and return to landing page"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(148,168,210,0.18)] font-mono text-xl leading-none text-[#8B98B4] transition-colors hover:border-[#FFB020] hover:text-[#FFB020]"
        >
          ×
        </Link>

        <Link
          href="/"
          className="mb-8 inline-flex pr-10 font-display text-lg font-bold tracking-[0.02em]"
        >
          ORBITOPS
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#4FD1E8]">
          Organization setup
        </p>
        <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight">
          Create your workspace Admin
        </h1>
        <p className="mt-2 text-sm text-[#8B98B4]">
          Create a new organization and its first Admin. Normal signup
          still creates Employee accounts.
        </p>
        <SetupForm />
      </section>
    </main>
  );
}
