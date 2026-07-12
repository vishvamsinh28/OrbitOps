import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  createMaintenanceAction,
  updateMaintenanceAction,
} from "../actions/maintenance";
import { canManageAssets, requireUser } from "@/lib/auth";
import { listMaintenanceData } from "@/lib/data";

async function getMaintenanceData() {
  return listMaintenanceData();
}

export default async function MaintenancePage() {
  const user = await requireUser();
  const canManage = canManageAssets(user.role);
  const { assets, requests } = await getMaintenanceData();

  return (
    <>
      <PageHeader eyebrow="Maintenance" title="Maintenance requests">
        Raise, approve, assign, and resolve repair workflows.
      </PageHeader>

      <div className="grid gap-6 min-[961px]:grid-cols-[0.7fr_1fr]">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Raise request
          </h2>
          <form action={createMaintenanceAction} className="mt-5 grid gap-4">
            <SelectField name="asset" label="Asset" required>
              <option value="">Select asset</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.assetTag} — {asset.name}
                </option>
              ))}
            </SelectField>
            <SelectField name="priority" label="Priority">
              {["Low", "Medium", "High", "Critical"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </SelectField>
            <TextField name="issueDescription" label="Issue description" required />
            <SubmitButton>Raise request</SubmitButton>
          </form>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Request queue
          </h2>
          <div className="mt-5 grid gap-4">
            {requests.map((request) => (
              <form
                key={request._id}
                action={updateMaintenanceAction}
                className="grid gap-3 border-b border-white/10 pb-4"
              >
                <input type="hidden" name="request" value={request._id} />
                <p className="font-medium">
                  {request.asset?.assetTag} — {request.priority}
                </p>
                <p className="text-sm text-[#8B98B4]">
                  {request.issueDescription} · {request.status}
                </p>
                {canManage ? (
                  <div className="grid gap-3 min-[760px]:grid-cols-3">
                    <SelectField name="status" label="Status">
                      {[
                        "Pending",
                        "Approved",
                        "Rejected",
                        "Technician Assigned",
                        "In Progress",
                        "Resolved",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </SelectField>
                    <TextField name="technician" label="Technician" />
                    <TextField name="resolutionNotes" label="Resolution notes" />
                    <SubmitButton>Update</SubmitButton>
                  </div>
                ) : null}
              </form>
            ))}
            {requests.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No requests yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
