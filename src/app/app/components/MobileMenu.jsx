"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

export function MobileMenu({ navItems }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const drawer = (
    <div className="fixed inset-0 z-[9999] bg-[#080B14] text-[#E9EDF6]">
      <div className="flex min-h-[68px] items-center justify-between border-b border-[rgba(148,168,210,0.14)] bg-[#0D1220] px-5">
        <Link
          href="/app/dashboard"
          onClick={() => setOpen(false)}
          className="font-display text-2xl font-semibold leading-none text-[#E9EDF6]"
        >
          OrbitOps
        </Link>

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(148,168,210,0.18)] text-2xl leading-none text-[#8B98B4] hover:border-[#FFB020] hover:text-[#FFB020]"
        >
          ×
        </button>
      </div>

      <nav className="grid gap-2 px-5 py-6">
        {navItems.map(({ label, href }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex min-h-[54px] items-center gap-4 rounded-[8px] border px-4 text-base font-semibold transition-colors ${
                active
                  ? "border-[#FFB020]/45 bg-[#FFB020]/12 text-[#FFCA5F]"
                  : "border-transparent text-[#AAB3C7] hover:border-[rgba(148,168,210,0.18)] hover:bg-white/5 hover:text-[#E9EDF6]"
              }`}
            >
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="relative min-[961px]:hidden">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((visible) => !visible)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(148,168,210,0.24)] text-[#E9EDF6] transition-colors hover:border-[#FFB020] hover:text-[#FFB020]"
      >
        <span className="grid gap-1">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>

      {open ? createPortal(drawer, document.body) : null}
    </div>
  );
}
