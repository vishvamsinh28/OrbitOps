import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import { createAuditCycleAction } from "../actions/audits";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { listAuditData } from "@/lib/data";

export default async function AuditsPage() {
  const user = await requireUser();
  const canCreate = user.role === ROLES.ADMIN || canManageAssets(user.role);
  const { cycles, departments, users, locations } = await listAuditData(
    user.organization?._id,
  );

  return (
    <>
      <PageHeader eyebrow="Asset audits" title="Audit cycles">
        Assign auditors, verify assets, and close discrepancy reports.
      </PageHeader>

      {canCreate ? (
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Create audit cycle
          </h2>
          <form action={createAuditCycleAction} className="mt-5 grid gap-4">
            <div className="grid gap-4 min-[900px]:grid-cols-3">
              <TextField name="name" label="Cycle name" required />
              <SelectField name="scopeType" label="Scope">
                <option value="All">All assets</option>
                <option value="Department">Department</option>
                <option value="Location">Location</option>
              </SelectField>
              <SelectField name="department" label="Department scope">
                <option value="">No department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </SelectField>
              <SelectField name="location" label="Location scope">
                <option value="">No location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </SelectField>
              <SelectField name="auditors" label="Auditor" required>
                <option value="">Select auditor</option>
                {users.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </SelectField>
            </div>
            <SubmitButton>Create cycle</SubmitButton>
          </form>
        </Panel>
      ) : null}

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">Audit history</h2>
        <div className="mt-5 grid gap-4">
          {cycles.map((cycle) => (
            <article
              key={cycle._id}
              className="grid gap-3 border-b border-white/10 pb-4 min-[760px]:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-medium">{cycle.name}</p>
                <p className="text-sm text-[#8B98B4]">
                  {cycle.scopeType} · {cycle.status} · {cycle.itemCount} assets ·{" "}
                  {cycle.discrepancyCount} discrepancies
                </p>
              </div>
              <a
                href={`/app/audits/${cycle._id}`}
                className="self-start rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-[#E9EDF6]"
              >
                Open report
              </a>
            </article>
          ))}
          {cycles.length === 0 ? (
            <p className="text-sm text-[#8B98B4]">No audit cycles yet.</p>
          ) : null}
        </div>
      </Panel>
    </>
  );
}
