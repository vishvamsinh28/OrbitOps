import { notFound } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { Panel } from "../../components/Panel";
import { SelectField, SubmitButton, TextField } from "../../components/FormControls";
import {
  closeAuditCycleAction,
  updateAuditItemAction,
} from "../../actions/audits";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { getAuditCycleData } from "@/lib/data";

export default async function AuditCyclePage({ params }) {
  const user = await requireUser();
  const { id } = await params;
  const { cycle, items } = await getAuditCycleData(id, user.organization?._id);

  if (!cycle) notFound();

  const canClose = user.role === ROLES.ADMIN || canManageAssets(user.role);
  const discrepancies = items.filter((item) => item.discrepancy);

  return (
    <>
      <PageHeader eyebrow="Audit report" title={cycle.name}>
        {cycle.scopeType} scope · {cycle.status}
      </PageHeader>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Discrepancy report
            </h2>
            <p className="mt-1 text-sm text-[#8B98B4]">
              {discrepancies.length} flagged of {items.length} audit items.
            </p>
          </div>
          {canClose && cycle.status !== "Closed" ? (
            <form action={closeAuditCycleAction}>
              <input type="hidden" name="cycle" value={cycle._id} />
              <SubmitButton>Close cycle</SubmitButton>
            </form>
          ) : null}
        </div>
        <div className="mt-5 grid gap-3">
          {discrepancies.map((item) => (
            <article key={item._id} className="border-b border-white/10 pb-3">
              <p className="font-medium">
                {item.assetTag} — {item.assetName}
              </p>
              <p className="text-sm text-[#8B98B4]">
                {item.observedStatus} · {item.notes || "No notes"}
              </p>
            </article>
          ))}
          {discrepancies.length === 0 ? (
            <p className="text-sm text-[#8B98B4]">No discrepancies flagged.</p>
          ) : null}
        </div>
      </Panel>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">Audit items</h2>
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <form
              key={item._id}
              action={updateAuditItemAction}
              className="grid gap-3 border-b border-white/10 pb-4 min-[980px]:grid-cols-[1fr_180px_1fr_auto]"
            >
              <input type="hidden" name="item" value={item._id} />
              <div>
                <p className="font-medium">
                  {item.assetTag} — {item.assetName}
                </p>
                <p className="text-sm text-[#8B98B4]">
                  Current: {item.assetStatus} · {item.location || "No location"}
                </p>
                {item.checkedByName ? (
                  <p className="text-sm text-[#586180]">
                    Checked by {item.checkedByName}
                  </p>
                ) : null}
              </div>
              <SelectField
                name="observedStatus"
                label="Observed"
                defaultValue={item.observedStatus || ""}
                disabled={cycle.status === "Closed"}
              >
                <option value="">Not checked</option>
                {["Verified", "Missing", "Damaged"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectField>
              <TextField
                name="notes"
                label="Notes"
                defaultValue={item.notes || ""}
                disabled={cycle.status === "Closed"}
              />
              <div className="self-end">
                {cycle.status === "Closed" ? (
                  <span className="font-mono text-xs text-[#586180]">Locked</span>
                ) : (
                  <SubmitButton>Save</SubmitButton>
                )}
              </div>
            </form>
          ))}
        </div>
      </Panel>
    </>
  );
}
