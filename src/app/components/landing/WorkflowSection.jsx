export function WorkflowSection() {
  return (
  <section
    id="workflow"
    className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
  >
    <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
      <div className="section-heading reveal mb-14 max-w-[620px]">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
          End to end
        </span>

        <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
          How an asset moves through OrbitOps.
        </h2>

        <p className="text-[15.5px] text-[#8B98B4]">
          The same sequence, whether it&apos;s a laptop, a fleet
          vehicle, or a conference room.
        </p>
      </div>

      <div className="timeline relative max-w-[760px] pl-9">
        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            01
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Setup.
            </strong>{" "}
            Admin creates departments and asset categories, then
            promotes selected employees to Department Head or
            Asset Manager.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            02
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Registration.
            </strong>{" "}
            Asset Manager registers a new asset; it enters the
            system as Available.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            03
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Allocation.
            </strong>{" "}
            The asset is assigned to a person or department — an
            existing allocation blocks the request and offers a
            transfer instead.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            04
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Or, shared use.
            </strong>{" "}
            The asset can instead be marked bookable, opening it
            to time-slot reservations.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            05
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Booking.
            </strong>{" "}
            Employees reserve shared resources; overlapping
            requests are rejected automatically.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            06
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Maintenance.
            </strong>{" "}
            A holder raises a request, which must be approved
            before repair work — and the status change — begins.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            07
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Transfers & returns.
            </strong>{" "}
            Assets move as organizational needs change; returns
            past their expected date are flagged overdue
            automatically.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            08
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Audit.
            </strong>{" "}
            Cycles are scheduled, auditors assigned, assets
            verified, and discrepancy reports generated before
            the cycle locks.
          </p>
        </div>

        <div className="timeline-step reveal">
          <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
            09
          </span>

          <p className="max-w-[600px] text-sm text-[#8B98B4]">
            <strong className="font-medium text-[#E9EDF6]">
              Visibility.
            </strong>{" "}
            Every step surfaces through notifications, activity
            logs, the dashboard, and exportable reports.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
}
