"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileMenu({ navItems }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-[961px]:hidden">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((visible) => !visible)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(148,168,210,0.24)] text-[#E9EDF6] transition-colors hover:border-[#FFB020] hover:text-[#FFB020]"
      >
        <span className="grid gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <nav className="absolute right-0 top-12 z-50 grid min-w-[210px] gap-1 rounded-md border border-[rgba(148,168,210,0.18)] bg-[#0D1220] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-[#8B98B4] transition-colors hover:bg-white/5 hover:text-[#E9EDF6]"
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
