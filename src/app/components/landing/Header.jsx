import { HeaderNavigation } from "./HeaderNavigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(148,168,210,0.14)] bg-[rgba(8,11,20,0.82)] backdrop-blur-[14px]">
      <div className="relative z-[1] mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
        <nav className="flex items-center justify-between py-[18px]">
          <a
            href="#"
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.02em]"
          >
            <span className="relative h-[26px] w-[26px] rounded-full border-[1.5px] border-[#FFB020]">
              <span className="animate-logo-orbit absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-[#FFB020] shadow-[0_0_6px_#FFB020]" />
            </span>
            ORBITOPS
          </a>ś

          <HeaderNavigation />

          <a
            href="/signup"
            className="rounded-md border border-[rgba(148,168,210,0.28)] px-3 py-[9px] text-center font-mono text-[12px] leading-none transition-all hover:border-[#FFB020] hover:bg-[rgba(255,176,32,0.14)] hover:text-[#FFB020] min-[421px]:px-[18px] min-[421px]:text-[13px]"
          >
            <span className="min-[421px]:hidden">Sign up</span>
            <span className="hidden min-[421px]:inline">Create account</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
