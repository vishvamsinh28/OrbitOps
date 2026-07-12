import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  createTransferAction,
  decideTransferAction,
} from "../actions/transfers";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Asset from "@/models/Asset";
import Department from "@/models/Department";
import TransferRequest from "@/models/TransferRequest";
import User from "@/models/User";

async function getTransferData() {
  await connectDB();

  const [assets, users, departments, transfers] = await Promise.all([
    Asset.find({ status: { $in: ["Allocated", "Available"] } })
      .sort({ assetTag: 1 })
      .lean(),
    User.find({ status: "Active" }).sort({ name: 1 }).lean(),
    Department.find({ status: "Active" }).sort({ name: 1 }).lean(),
    TransferRequest.find()
      .sort({ createdAt: -1 })
      .populate("asset", "name assetTag status")
      .populate("requestedBy", "name")
      .lean(),
  ]);

  return JSON.parse(JSON.stringify({ assets, users, departments, transfers }));
}

export default async function TransfersPage() {
  const user = await requireUser();
  const canDecide =
    canManageAssets(user.role) || user.role === ROLES.DEPARTMENT_HEAD;
  const { assets, users, departments, transfers } = await getTransferData();

  return (
    <>
      <PageHeader eyebrow="Transfers" title="Transfer requests">
        Request holder changes and approve them without overwriting records.
      </PageHeader>

      <div className="grid gap-6 min-[961px]:grid-cols-[0.7fr_1fr]">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Create transfer request
          </h2>
          <form action={createTransferAction} className="mt-5 grid gap-4">
            <SelectField name="asset" label="Asset" required>
              <option value="">Select asset</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.assetTag} — {asset.name}
                </option>
              ))}
            </SelectField>
            <SelectField name="toHolderType" label="New holder type" required>
              <option value="User">Employee</option>
              <option value="Department">Department</option>
            </SelectField>
            <SelectField name="toHolder" label="New holder" required>
              <option value="">Select employee or department</option>
              {users.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  Employee: {employee.name}
                </option>
              ))}
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  Department: {department.name}
                </option>
              ))}
            </SelectField>
            <TextField name="notes" label="Notes" />
            <SubmitButton>Create transfer</SubmitButton>
          </form>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Transfer queue
          </h2>
          <div className="mt-5 grid gap-4">
            {transfers.map((transfer) => (
              <article key={transfer._id} className="border-b border-white/10 pb-4">
                <p className="font-medium">
                  {transfer.asset?.assetTag} — {transfer.status}
                </p>
                <p className="text-sm text-[#8B98B4]">
                  Requested by {transfer.requestedBy?.name || "Unknown"}
                </p>
                {canDecide && transfer.status === "Requested" ? (
                  <form action={decideTransferAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="transfer" value={transfer._id} />
                    <TextField name="decisionNotes" label="Decision notes" />
                    <div className="flex gap-2">
                      <button
                        name="decision"
                        value="approve"
                        className="rounded-[7px] bg-[#3DDC97] px-4 py-2.5 font-mono text-sm text-[#06130D]"
                      >
                        Approve
                      </button>
                      <button
                        name="decision"
                        value="reject"
                        className="rounded-[7px] border border-[#FF6B6B]/40 px-4 py-2.5 font-mono text-sm text-[#FFB5B5]"
                      >
                        Reject
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>
            ))}
            {transfers.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No transfers yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
