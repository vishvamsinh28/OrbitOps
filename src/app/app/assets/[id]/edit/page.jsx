import { notFound, redirect } from "next/navigation";
import { Panel } from "../../../components/Panel";
import { PageHeader } from "../../../components/PageHeader";
import {
  FileField,
  SelectField,
  SubmitButton,
  TextField,
} from "../../../components/FormControls";
import { updateAssetAction } from "../../../actions/assets";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getAssetEditData } from "@/lib/data";

export default async function EditAssetPage({ params }) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) redirect("/app/assets");
  const organizationId = user.organization?._id;
  if (!organizationId) redirect("/app/assets");

  const { id } = await params;
  await connectDB();

  const { asset, categories, departments, allocationHistory, maintenanceHistory } =
    await getAssetEditData(id, organizationId);

  if (!asset) notFound();

  return (
    <>
      <PageHeader eyebrow="Edit asset" title={`Edit ${asset.assetTag}`}>
        Update asset details.
      </PageHeader>

      <Panel>
        <form action={updateAssetAction} className="mt-5 grid gap-4">
          <input type="hidden" name="assetId" value={asset._id} />

          <div className="grid gap-4 min-[760px]:grid-cols-2">
            <TextField
              name="name"
              label="Asset name"
              required
              defaultValue={asset.name}
            />
            <SelectField
              name="category"
              label="Category"
              required
              defaultValue={asset.category?._id || ""}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </SelectField>
            <TextField
              name="serialNumber"
              label="Serial number"
              defaultValue={asset.serialNumber || ""}
            />
            <TextField
              name="location"
              label="Location"
              defaultValue={asset.location || ""}
            />
            <TextField
              name="condition"
              label="Condition"
              defaultValue={asset.condition || "Good"}
            />
            <SelectField
              name="department"
              label="Department"
              defaultValue={asset.department?._id || ""}
            >
              <option value="">No department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </SelectField>
            <TextField
              name="acquisitionDate"
              label="Acquisition date"
              type="date"
              defaultValue={
                asset.acquisitionDate
                  ? new Date(asset.acquisitionDate).toISOString().split("T")[0]
                  : ""
              }
            />
            <TextField
              name="acquisitionCost"
              label="Acquisition cost"
              type="number"
              defaultValue={asset.acquisitionCost ?? ""}
            />
            <TextField
              name="imageUrl"
              label="Image URL"
              defaultValue={asset.imageUrl || ""}
            />
            <TextField
              name="documentUrl"
              label="Document URL"
              defaultValue={asset.documentUrl || ""}
            />
            <FileField
              name="imageFile"
              label="Replace image"
              accept="image/png,image/jpeg,image/webp,image/gif"
            />
            <FileField
              name="documentFile"
              label="Replace document"
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
            />
          </div>
          <TextField
            name="description"
            label="Description"
            defaultValue={asset.description || ""}
          />
          <label className="flex items-center gap-2 text-sm text-[#8B98B4]">
            <input
              name="isBookable"
              type="checkbox"
              defaultChecked={asset.isBookable}
            />
            Shared or bookable resource
          </label>
          <SubmitButton>Save changes</SubmitButton>
        </form>
      </Panel>

      <div className="mt-6 grid gap-6 min-[961px]:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Allocation history
          </h2>
          <div className="mt-5 grid gap-4">
            {allocationHistory.map((item) => (
              <article key={item._id} className="border-b border-white/10 pb-4">
                <p className="font-medium">
                  {item.holderType}: {item.holderName || "Unknown"} · {item.status}
                </p>
                <p className="text-sm text-[#8B98B4]">
                  Allocated{" "}
                  {item.allocationDate
                    ? new Date(item.allocationDate).toLocaleDateString()
                    : "unknown"}
                  {item.returnDate
                    ? ` · Returned ${new Date(item.returnDate).toLocaleDateString()}`
                    : ""}
                </p>
                {item.conditionNotes ? (
                  <p className="text-sm text-[#586180]">{item.conditionNotes}</p>
                ) : null}
              </article>
            ))}
            {allocationHistory.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No allocation history.</p>
            ) : null}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Maintenance history
          </h2>
          <div className="mt-5 grid gap-4">
            {maintenanceHistory.map((item) => (
              <article key={item._id} className="border-b border-white/10 pb-4">
                <p className="font-medium">
                  {item.priority} · {item.status}
                </p>
                <p className="text-sm text-[#8B98B4]">{item.issueDescription}</p>
                <p className="text-sm text-[#586180]">
                  Requested by {item.requestedByName || "Unknown"}
                  {item.technician ? ` · Tech ${item.technician}` : ""}
                </p>
                {item.attachmentUrl ? (
                  <a
                    href={item.attachmentUrl}
                    className="mt-2 inline-flex font-mono text-xs text-[#FFB020]"
                  >
                    Attachment
                  </a>
                ) : null}
              </article>
            ))}
            {maintenanceHistory.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No maintenance history.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
