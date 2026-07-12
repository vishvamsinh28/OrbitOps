import Link from "next/link";
import { getVisibleNavItems, requireUser } from "@/lib/auth";
import { MobileMenu } from "./MobileMenu";

export async function AppShell({ children }) {
  const user = await requireUser();
  const navItems = getVisibleNavItems(user.role);

  return (
    <main className="allow-overflow min-h-screen bg-[#080B14]">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-[rgba(148,168,210,0.14)] bg-[#0D1220] px-4 py-5 min-[961px]:block">
        <Link href="/app/dashboard" className="font-display text-xl font-bold">
          ORBITOPS
        </Link>

        <nav className="mt-8 grid gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm text-[#8B98B4] transition-colors hover:bg-white/5 hover:text-[#E9EDF6]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-[961px]:pl-[240px]">
        <header className="sticky top-0 z-40 border-b border-[rgba(148,168,210,0.14)] bg-[rgba(8,11,20,0.86)] backdrop-blur-[14px]">
          <div className="flex min-h-[68px] items-center justify-between gap-4 px-5 min-[601px]:px-8">
            <div>
              <p className="font-mono text-[11px] uppercase text-[#586180]">
                {user.role}
              </p>
              <p className="font-display text-lg font-semibold">
                {user.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden text-sm text-[#8B98B4] hover:text-[#E9EDF6] min-[601px]:inline"
              >
                Landing
              </Link>
              <a
                href="/logout"
                className="rounded-md border border-[rgba(148,168,210,0.24)] px-3 py-2 font-mono text-xs"
              >
                Logout
              </a>
              <MobileMenu navItems={navItems} />
            </div>
          </div>
        </header>

        <div className="px-5 py-8 min-[601px]:px-8">{children}</div>
      </section>
    </main>
  );
}
