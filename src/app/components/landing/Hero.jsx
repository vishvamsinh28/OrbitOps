import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
  <section className="hero-section relative z-10 mx-auto grid max-w-[1180px] scroll-mt-[88px] grid-cols-1 items-center gap-10 px-5 py-[70px] min-[601px]:px-8 min-[961px]:grid-cols-[1.05fr_0.95fr] min-[961px]:pb-[70px] min-[961px]:pt-[88px]">
    <div className="hero-column relative z-[1]">
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
        Enterprise Asset & Resource Management
      </span>

      <h1 className="my-[22px] max-w-[560px] font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.01em] min-[601px]:text-[38px] min-[961px]:text-[52px]">
        Every asset,{" "}
        <span className="hero-accent">
          tracked in real time
        </span>{" "}
        — not chased through spreadsheets.
      </h1>

      <p className="mb-[34px] max-w-[480px] text-[16.5px] text-[#8B98B4]">
        OrbitOps centralizes the full lifecycle of equipment,
        rooms, vehicles, and shared resources — who holds what,
        where it lives, and what condition it&apos;s in — so your
        team stops reconciling logs and starts trusting one system
        of record.
      </p>

      <div className="mb-11 flex flex-wrap gap-3.5">
        <a
          href="#modules"
          className="group inline-flex items-center gap-[9px] rounded-[7px] border border-transparent bg-[#FFB020] px-[22px] py-[13px] font-mono text-[13.5px] font-medium text-[#0A0E1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-12px_rgba(255,176,32,0.45)] transition-all hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(255,176,32,0.14),0_14px_28px_-12px_rgba(255,176,32,0.55)]"
        >
          Explore the modules
          <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
            →
          </span>
        </a>

        <a
          href="#workflow"
          className="group inline-flex items-center gap-[9px] rounded-[7px] border border-[rgba(148,168,210,0.28)] bg-[rgba(255,255,255,0.02)] px-[22px] py-[13px] font-mono text-[13.5px] font-medium transition-all hover:-translate-y-px hover:border-[#4FD1E8] hover:bg-[rgba(79,209,232,0.14)] hover:text-[#4FD1E8]"
        >
          See the workflow
          <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
            →
          </span>
        </a>
      </div>

      <div className="hero-stat-grid border-t border-[rgba(148,168,210,0.14)] pt-[26px] font-mono text-xs text-[#586180]">
        <div className="hero-stat">
          <strong
            data-count="7"
            className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
          >
            0
          </strong>
          lifecycle states
        </div>

        <div className="hero-stat">
          <strong
            data-count="10"
            className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
          >
            0
          </strong>
          core modules
        </div>

        <div className="hero-stat">
          <strong
            data-count="4"
            className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
          >
            0
          </strong>
          role tiers
        </div>

        <div className="hero-stat">
          <strong
            data-count="0"
            className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
          >
            0
          </strong>
          spreadsheets
        </div>
      </div>
    </div>

      <HeroVisual />
    </section>
  );
}
