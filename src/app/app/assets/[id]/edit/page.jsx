import { notFound, redirect } from "next/navigation";
import { Panel } from "../../../components/Panel";
import { PageHeader } from "../../../components/PageHeader";
import { SelectField, SubmitButton, TextField } from "../../../components/FormControls";
import { updateAssetAction } from "../../../actions/assets";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getAssetEditData } from "@/lib/data";

export default async function EditAssetPage({ params }) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) redirect("/app/assets");

  const { id } = await params;
  await connectDB();

  const { asset, categories, departments } = await getAssetEditData(id);

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
    </>
  );
}
