import { OrbitDiagram } from "./OrbitDiagram";

export function HeroVisual() {
  return (
    <div className="hero-column relative z-[1]">
      <div className="orbit-visual mx-auto max-w-[460px]">
        <OrbitDiagram />
  <div className="hero-float-card">
    <div className="mb-2.5 flex items-center gap-[7px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#586180]">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#3DDC97] shadow-[0_0_6px_#3DDC97]" />
      Live · today
    </div>

    <strong
      data-count="24"
      className="block font-display text-[27px] font-semibold leading-none"
    >
      0
    </strong>

    <span className="mt-[5px] block font-mono text-[10px] text-[#8B98B4]">
      asset events logged
    </span>

    <svg
      className="mt-3 block h-[26px] w-full"
      viewBox="0 0 120 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points="0,22 15,18 30,20 45,10 60,14 75,6 90,9 105,4 120,8"
        fill="none"
        stroke="#4FD1E8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  </div>
</div>
<div className="mt-[22px] flex flex-wrap justify-center gap-4 font-mono text-[10.5px] text-[#586180]">
  <span className="inline-flex items-center gap-1.5">
    <i className="h-[7px] w-[7px] rounded-full bg-[#3DDC97] shadow-[0_0_6px_#3DDC97]" />
    Available
  </span>

  <span className="inline-flex items-center gap-1.5">
    <i className="h-[7px] w-[7px] rounded-full bg-[#FFB020] shadow-[0_0_6px_#FFB020]" />
    Allocated
  </span>

  <span className="inline-flex items-center gap-1.5">
    <i className="h-[7px] w-[7px] rounded-full bg-[#4FD1E8] shadow-[0_0_6px_#4FD1E8]" />
    Reserved
  </span>

  <span className="inline-flex items-center gap-1.5">
    <i className="h-[7px] w-[7px] rounded-full bg-[#FF6B6B] shadow-[0_0_6px_#FF6B6B]" />
    Maintenance
  </span>
</div>
    </div>
  );
}
