export function TickerAndStats() {
  return (
    <>
<div className="ticker-strip" aria-hidden="true">
  <div className="ticker-track">
    <span className="ticker-item">
      <i className="ticker-dot bg-[#3DDC97]" />
      ORB-0021 checked in <b>·</b> condition noted, status
      Available
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FFB020]" />
      ORB-0114 allocated <b>·</b> Engineering, expected return
      08 Aug
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#4FD1E8]" />
      Room B2 booked <b>·</b> 10:00–11:00, no overlap detected
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FF6B6B]" />
      ORB-0077 maintenance approved <b>·</b> technician
      assigned
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#9C8CFF]" />
      Transfer request <b>·</b> awaiting Department Head
      sign-off
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FF6B6B]" />
      Overdue return flagged <b>·</b> ORB-0142, 3 days past due
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#3DDC97]" />
      Audit cycle Q3 closed <b>·</b> 2 discrepancies logged
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#3DDC97]" />
      ORB-0021 checked in <b>·</b> condition noted, status
      Available
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FFB020]" />
      ORB-0114 allocated <b>·</b> Engineering, expected return
      08 Aug
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#4FD1E8]" />
      Room B2 booked <b>·</b> 10:00–11:00, no overlap detected
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FF6B6B]" />
      ORB-0077 maintenance approved <b>·</b> technician
      assigned
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#9C8CFF]" />
      Transfer request <b>·</b> awaiting Department Head
      sign-off
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#FF6B6B]" />
      Overdue return flagged <b>·</b> ORB-0142, 3 days past due
    </span>

    <span className="ticker-item">
      <i className="ticker-dot bg-[#3DDC97]" />
      Audit cycle Q3 closed <b>·</b> 2 discrepancies logged
    </span>
  </div>
</div>

<div className="relative z-10 border-y border-[rgba(148,168,210,0.14)] py-[30px]">
  <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-5 min-[601px]:grid-cols-2 min-[601px]:px-8 min-[961px]:grid-cols-4">
    <div className="stat reveal">
      <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
        Allocation checks
      </strong>

      <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
        Conflict-checked before assignment
      </span>
    </div>

    <div className="stat reveal">
      <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
        Overlap validation
      </strong>

      <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
        Bookings rejected on time-slot collision
      </span>
    </div>

    <div className="stat reveal">
      <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
        Approval-gated repairs
      </strong>

      <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
        Status flips only after sign-off
      </span>
    </div>

    <div className="stat reveal">
      <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
        Locked audit cycles
      </strong>

      <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
        Discrepancy reports generated automatically
      </span>
    </div>
  </div>
</div>
    </>
  );
}
