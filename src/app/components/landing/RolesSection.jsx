export function RolesSection() {
  return (
  <section
    id="roles"
    className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
  >
    <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
      <div className="section-heading reveal mb-14 max-w-[620px]">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
          Access
        </span>

        <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
          Four roles, scoped to what each one should touch.
        </h2>

        <p className="text-[15.5px] text-[#8B98B4]">
          Nobody signs up into power. Roles are granted
          deliberately, and every screen respects the boundary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[18px] min-[601px]:grid-cols-2 min-[961px]:grid-cols-4">
        <article
          className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
          style={{
            "--role-color": "var(--amber)",
            transitionDelay: "0ms",
          }}
        >
          <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
            TIER 01
          </span>

          <h3 className="mb-3.5 font-display text-[17px] font-semibold">
            Admin
          </h3>

          <ul className="flex list-none flex-col gap-[9px]">
            <li className="role-list-item">
              Manages departments & categories
            </li>
            <li className="role-list-item">
              Runs audit cycles
            </li>
            <li className="role-list-item">
              Grants Department Head & Asset Manager roles
            </li>
            <li className="role-list-item">
              Views org-wide analytics
            </li>
          </ul>
        </article>

        <article
          className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
          style={{
            "--role-color": "var(--cyan)",
            transitionDelay: "80ms",
          }}
        >
          <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
            TIER 02
          </span>

          <h3 className="mb-3.5 font-display text-[17px] font-semibold">
            Asset Manager
          </h3>

          <ul className="flex list-none flex-col gap-[9px]">
            <li className="role-list-item">
              Registers & allocates assets
            </li>
            <li className="role-list-item">
              Approves transfers & returns
            </li>
            <li className="role-list-item">
              Approves maintenance requests
            </li>
            <li className="role-list-item">
              Resolves audit discrepancies
            </li>
          </ul>
        </article>

        <article
          className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
          style={{
            "--role-color": "var(--green)",
            transitionDelay: "160ms",
          }}
        >
          <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
            TIER 03
          </span>

          <h3 className="mb-3.5 font-display text-[17px] font-semibold">
            Department Head
          </h3>

          <ul className="flex list-none flex-col gap-[9px]">
            <li className="role-list-item">
              Views department-held assets
            </li>
            <li className="role-list-item">
              Approves department allocations
            </li>
            <li className="role-list-item">
              Approves department transfers
            </li>
            <li className="role-list-item">
              Books shared resources
            </li>
          </ul>
        </article>

        <article
          className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
          style={{
            "--role-color": "var(--violet)",
            transitionDelay: "240ms",
          }}
        >
          <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
            TIER 04
          </span>

          <h3 className="mb-3.5 font-display text-[17px] font-semibold">
            Employee
          </h3>

          <ul className="flex list-none flex-col gap-[9px]">
            <li className="role-list-item">
              Views assets allocated to them
            </li>
            <li className="role-list-item">
              Books shared resources
            </li>
            <li className="role-list-item">
              Raises maintenance requests
            </li>
            <li className="role-list-item">
              Initiates returns & transfers
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
  );
}
