export function LifecycleSection() {
  return (
  <section
    id="lifecycle"
    className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
  >
    <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
      <div className="section-heading reveal mb-14 max-w-[620px]">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
          Lifecycle
        </span>

        <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
          Every asset carries a single, honest status.
        </h2>

        <p className="text-[15.5px] text-[#8B98B4]">
          Status changes only happen through defined transitions
          — never a manual overwrite — so the record on screen
          matches what&apos;s actually true in the building.
        </p>
      </div>

      <div className="lifecycle-panel reveal rounded-2xl border border-[rgba(148,168,210,0.14)] px-5 py-10 min-[601px]:px-10 min-[601px]:py-12">
        <div className="mt-3 flex flex-wrap items-center justify-center">
          <div className="life-node">
            <i className="text-[#3DDC97]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
            </i>
            Available
          </div>

          <span className="px-3 text-base text-[#586180]">
            ⇄
          </span>

          <div className="life-node">
            <i className="text-[#FF6B6B]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#FF6B6B]" />
            </i>
            Under Maintenance
          </div>

          <span className="px-3 text-base text-[#586180]">
            →
          </span>

          <div className="life-node">
            <i className="text-[#3DDC97]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
            </i>
            Available
          </div>

          <span className="px-3 text-base text-[#586180]">
            →
          </span>

          <div className="life-node">
            <i className="text-[#FFB020]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#FFB020]" />
            </i>
            Allocated
          </div>

          <span className="px-3 text-base text-[#586180]">
            →
          </span>

          <div className="life-node">
            <i className="text-[#3DDC97]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
            </i>
            Available
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 border-t border-[rgba(148,168,210,0.14)] pt-6 min-[961px]:grid-cols-2">
          <div className="text-[13.5px] text-[#8B98B4]">
            <strong className="mb-1.5 block font-mono text-xs tracking-[0.04em] text-[#E9EDF6]">
              RESERVED & LOST
            </strong>

            Shared resources move to Reserved on booking; an asset
            an auditor can&apos;t locate is marked Lost and flows
            into the discrepancy report.
          </div>

          <div className="text-[13.5px] text-[#8B98B4]">
            <strong className="mb-1.5 block font-mono text-xs tracking-[0.04em] text-[#E9EDF6]">
              RETIRED & DISPOSED
            </strong>

            End-of-life states close out the asset&apos;s record
            while its full allocation and maintenance history
            stays intact.
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
