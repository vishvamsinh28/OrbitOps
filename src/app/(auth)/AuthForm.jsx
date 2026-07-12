"use client";

import { useActionState, useState } from "react";

export function AuthForm({
  title,
  subtitle,
  action,
  submitLabel,
  includeName = false,
  footer,
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="relative w-full max-w-[420px] rounded-[8px] border border-[rgba(148,168,210,0.18)] bg-[#111725] p-6">
        <a
          href="/"
          aria-label="Close and return to landing page"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(148,168,210,0.18)] font-mono text-xl leading-none text-[#8B98B4] transition-colors hover:border-[#FFB020] hover:text-[#FFB020]"
        >
          ×
        </a>

        <a
          href="/"
          className="mb-8 inline-flex pr-10 font-display text-lg font-bold tracking-[0.02em]"
        >
          ORBITOPS
        </a>

        <h1 className="font-display text-[30px] font-semibold leading-tight">
          {title}
        </h1>

        <p className="mt-2 text-sm text-[#8B98B4]">{subtitle}</p>

        <form action={formAction} className="mt-8 grid gap-4">
          {includeName ? (
            <label className="grid gap-2 text-sm text-[#8B98B4]">
              Name
              <input
                name="name"
                required
                className="rounded-md border border-[rgba(148,168,210,0.22)] bg-[#0D1220] px-3 py-2.5 text-[#E9EDF6]"
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-sm text-[#8B98B4]">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-[rgba(148,168,210,0.22)] bg-[#0D1220] px-3 py-2.5 text-[#E9EDF6]"
            />
          </label>

          <label className="grid gap-2 text-sm text-[#8B98B4]">
            Password
            <span className="flex overflow-hidden rounded-md border border-[rgba(148,168,210,0.22)] bg-[#0D1220] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#4FD1E8]">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                minLength={8}
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[#E9EDF6] outline-none"
              />
              <button
                type="button"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
                className="border-l border-[rgba(148,168,210,0.16)] px-3 font-mono text-xs text-[#8B98B4] hover:text-[#E9EDF6]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {state?.error ? (
            <p className="rounded-md border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 px-3 py-2 text-sm text-[#FFB5B5]">
              {state.error}
            </p>
          ) : null}

          <button
            disabled={pending}
            className="rounded-[7px] bg-[#FFB020] px-4 py-3 font-mono text-sm font-medium text-[#0A0E1A]"
          >
            {pending ? "Working..." : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#8B98B4]">{footer}</p>
      </section>
    </main>
  );
}
