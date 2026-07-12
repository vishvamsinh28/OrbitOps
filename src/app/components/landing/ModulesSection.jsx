import { ModuleIcon } from "./ModuleIcon";
import { modules } from "./modulesData";

function ModuleCard({ module, index }) {
  return (
    <article
      className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <ModuleIcon name={module.icon} />

      <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
        MODULE {module.id}
      </span>

      <h3 className="mb-[9px] font-display text-[17px] font-semibold">
        {module.title}
      </h3>

      <p className="text-[13.5px] text-[#8B98B4]">
        {module.body}
      </p>
    </article>
  );
}

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
    >
      <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
        <div className="section-heading reveal mb-14 max-w-[620px]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
            Platform
          </span>

          <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
            Ten modules. One system of record.
          </h2>

          <p className="text-[15.5px] text-[#8B98B4]">
            From onboarding a department to closing an audit cycle,
            every workflow lives in the same place — no handoffs
            between spreadsheets, email threads, and paper logs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-[rgba(148,168,210,0.14)] min-[601px]:grid-cols-2 min-[961px]:grid-cols-5">
          {modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
