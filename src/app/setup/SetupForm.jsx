"use client";

import { useActionState, useState } from "react";
import { createFirstAdminAction } from "./actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(
    createFirstAdminAction,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm text-[#8B98B4]">
        Name
        <input
          name="name"
          required
          className="rounded-md border border-white/10 bg-[#0D1220] px-3 py-2.5"
        />
      </label>
      <label className="grid gap-2 text-sm text-[#8B98B4]">
        Email
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-white/10 bg-[#0D1220] px-3 py-2.5"
        />
      </label>
      <label className="grid gap-2 text-sm text-[#8B98B4]">
        Password
        <span className="flex overflow-hidden rounded-md border border-white/10 bg-[#0D1220] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#4FD1E8]">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            minLength={12}
            required
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
          />
          <button
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="border-l border-white/10 px-3 font-mono text-xs text-[#8B98B4] hover:text-[#E9EDF6]"
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
      <button className="rounded-[7px] bg-[#FFB020] px-4 py-3 font-mono text-sm font-medium text-[#0A0E1A]">
        {pending ? "Creating..." : "Create first Admin"}
      </button>
    </form>
  );
}
