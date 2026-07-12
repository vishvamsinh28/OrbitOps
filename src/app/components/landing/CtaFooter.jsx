export function CtaFooter() {
  return (
    <>
<section
  id="cta"
  className="cta-glow relative z-10 scroll-mt-[88px] border-y border-[rgba(148,168,210,0.14)] py-24 text-center"
>
  <div className="relative mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
    <span className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
      Ready when you are
    </span>

    <h2 className="mx-auto mb-4 mt-4 max-w-[620px] font-display text-[38px] font-semibold tracking-[-0.01em]">
      Stop tracking assets by memory and spreadsheet.
    </h2>

    <p className="mx-auto mb-[34px] max-w-[480px] text-[#8B98B4]">
      OrbitOps gives every department one shared, accurate
      answer to &quot;who has this, and where is it.&quot;
    </p>

    <div className="flex flex-wrap justify-center gap-3.5">
      <a
        href="/signup"
        className="inline-flex items-center rounded-[7px] border border-transparent bg-[#FFB020] px-[22px] py-[13px] font-mono text-[13.5px] font-medium text-[#0A0E1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-12px_rgba(255,176,32,0.45)] transition-all hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(255,176,32,0.14),0_14px_28px_-12px_rgba(255,176,32,0.55)]"
      >
        Create account
      </a>

      <a
        href="/login"
        className="inline-flex items-center rounded-[7px] border border-[rgba(148,168,210,0.28)] bg-[rgba(255,255,255,0.02)] px-[22px] py-[13px] font-mono text-[13.5px] font-medium transition-all hover:-translate-y-px hover:border-[#4FD1E8] hover:bg-[rgba(79,209,232,0.14)] hover:text-[#4FD1E8]"
      >
        Log in
      </a>
    </div>
  </div>
</section>

<footer className="relative z-10 py-11">
  <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3.5 px-5 font-mono text-[12.5px] text-[#586180] min-[601px]:px-8">
    <span>ORBITOPS — ASSET & RESOURCE MANAGEMENT</span>

    <div className="flex gap-[22px]">
      <a
        href="#modules"
        className="transition-colors hover:text-[#4FD1E8]"
      >
        Modules
      </a>

      <a
        href="#lifecycle"
        className="transition-colors hover:text-[#4FD1E8]"
      >
        Lifecycle
      </a>

      <a
        href="#roles"
        className="transition-colors hover:text-[#4FD1E8]"
      >
        Roles
      </a>

      <a
        href="#workflow"
        className="transition-colors hover:text-[#4FD1E8]"
      >
        Workflow
      </a>
    </div>

    <span>BUILT FOR THE TRACK</span>
  </div>
</footer>
    </>
  );
}
