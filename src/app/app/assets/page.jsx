import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import {
  FileField,
  SelectField,
  SubmitButton,
  TextField,
} from "../components/FormControls";
import {
  allocateAssetAction,
  registerAssetAction,
  returnAssetAction,
} from "../actions/assets";
import { canManageAssets, requireUser } from "@/lib/auth";
import { listAssetsData } from "@/lib/data";

async function getAssetsData(organizationId, filters) {
  return listAssetsData(organizationId, filters);
}

export default async function AssetsPage({ searchParams }) {
  const user = await requireUser();
  const organizationId = user.organization?._id;
  const canManage = canManageAssets(user.role);
  const params = await searchParams;
  const filters = {
    search: params?.q || "",
    status: params?.status || "",
    category: params?.category || "",
    department: params?.department || "",
  };
  const blockedAssetId = params?.blocked || "";
  const { assets, categories, departments, users, allocations } =
    await getAssetsData(organizationId, filters);
  const blockedAsset = assets.find((asset) => asset._id === blockedAssetId);
  const returnableAllocations = canManage
    ? allocations
    : allocations.filter(
        (allocation) =>
          allocation.holderType === "User" && allocation.holder === user._id,
      );

  return (
    <>
      <PageHeader eyebrow="Asset registry" title="Assets">
        Register assets, prevent double allocation, and close returns.
      </PageHeader>

      {canManage ? (
        <div className="grid gap-6 min-[1100px]:grid-cols-[1fr_0.8fr]">
          <Panel>
            <h2 className="font-display text-xl font-semibold">
              Register asset
            </h2>
            <form action={registerAssetAction} className="mt-5 grid gap-4">
              <div className="grid gap-4 min-[760px]:grid-cols-2">
                <TextField name="name" label="Asset name" required />
                <SelectField name="category" label="Category" required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </SelectField>
                <TextField name="serialNumber" label="Serial number" />
                <TextField name="location" label="Location" />
                <TextField name="condition" label="Condition" />
                <SelectField name="department" label="Department">
                  <option value="">No department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  name="acquisitionDate"
                  label="Acquisition date"
                  type="date"
                />
                <TextField
                  name="acquisitionCost"
                  label="Acquisition cost"
                  type="number"
                />
                <TextField name="imageUrl" label="Optional image URL" />
                <TextField name="documentUrl" label="Document URL" />
                <FileField
                  name="imageFile"
                  label="Upload image"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                />
                <FileField
                  name="documentFile"
                  label="Upload document"
                  accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                />
              </div>
              <TextField name="description" label="Description" />
              <label className="flex items-center gap-2 text-sm text-[#8B98B4]">
                <input name="isBookable" type="checkbox" />
                Shared or bookable resource
              </label>
              <SubmitButton>Register asset</SubmitButton>
            </form>
          </Panel>

          <Panel>
            <h2 className="font-display text-xl font-semibold">
              Allocate available asset
            </h2>
            <form action={allocateAssetAction} className="mt-5 grid gap-4">
              <SelectField name="asset" label="Asset" required>
                <option value="">Select asset</option>
                {assets
                  .filter((asset) => asset.status === "Available")
                  .map((asset) => (
                    <option key={asset._id} value={asset._id}>
                      {asset.assetTag} — {asset.name}
                    </option>
                  ))}
              </SelectField>
              <SelectField name="holderType" label="Holder type" required>
                <option value="User">Employee</option>
                <option value="Department">Department</option>
              </SelectField>
              <SelectField name="holder" label="Holder" required>
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
              <TextField name="expectedReturnDate" label="Expected return" type="date" />
              <TextField name="notes" label="Notes" />
              <SubmitButton>Allocate asset</SubmitButton>
            </form>
          </Panel>
        </div>
      ) : null}

      {blockedAsset ? (
        <Panel className="mt-6 border border-[#FFB020]/30">
          <h2 className="font-display text-xl font-semibold">
            Allocation blocked
          </h2>
          <p className="mt-2 text-sm text-[#8B98B4]">
            {blockedAsset.assetTag} is currently {blockedAsset.status}
            {blockedAsset.currentHolderName
              ? ` by ${blockedAsset.currentHolderName}`
              : ""}
            . Use a transfer request to move it cleanly.
          </p>
          <a
            href="/app/transfers"
            className="mt-4 inline-flex rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-[#E9EDF6]"
          >
            Create transfer request
          </a>
        </Panel>
      ) : null}

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Asset directory
        </h2>
        <form method="get" className="mt-5 grid gap-3 min-[900px]:grid-cols-[1fr_170px_190px_190px_auto]">
          <TextField
            name="q"
            label="Search"
            defaultValue={filters.search}
            placeholder="Tag, serial, location, name"
          />
          <SelectField name="status" label="Status" defaultValue={filters.status}>
            <option value="">Any status</option>
            {[
              "Available",
              "Allocated",
              "Reserved",
              "Under Maintenance",
              "Lost",
              "Retired",
              "Disposed",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>
          <SelectField name="category" label="Category" defaultValue={filters.category}>
            <option value="">Any category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </SelectField>
          <SelectField name="department" label="Department" defaultValue={filters.department}>
            <option value="">Any department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </SelectField>
          <div className="self-end">
            <SubmitButton>Filter</SubmitButton>
          </div>
        </form>
        <div className="mt-5 grid gap-4">
          {assets.map((asset) => (
            <article
              key={asset._id}
              className="grid gap-2 border-b border-white/10 pb-4 min-[760px]:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex gap-3">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-md border border-white/10 object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="font-medium">
                      {asset.assetTag} — {asset.name}
                    </p>
                    <p className="text-sm text-[#8B98B4]">
                      {asset.category?.name || "Uncategorized"} · {asset.status} ·{" "}
                      {asset.location || "No location"}
                    </p>
                    <p className="text-sm text-[#586180]">
                      {asset.currentHolderName
                        ? `Held by ${asset.currentHolderName}`
                        : "No active holder"}
                      {asset.serialNumber ? ` · Serial ${asset.serialNumber}` : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {asset.documentUrl ? (
                  <a
                    href={asset.documentUrl}
                    className="rounded-md border border-white/10 px-3 py-1 font-mono text-xs text-[#8B98B4] hover:text-[#E9EDF6]"
                  >
                    Document
                  </a>
                ) : null}
                {canManage ? (
                  <a
                    href={`/app/assets/${asset._id}/edit`}
                    className="rounded-md border border-white/10 px-3 py-1 font-mono text-xs text-[#8B98B4] hover:text-[#E9EDF6]"
                  >
                    Edit
                  </a>
                ) : null}
                <span className="self-start rounded-md border border-white/10 px-3 py-1 font-mono text-xs text-[#8B98B4]">
                  {asset.isBookable ? "Bookable" : "Asset"}
                </span>
              </div>
            </article>
          ))}
          {assets.length === 0 ? (
            <p className="text-sm text-[#8B98B4]">No assets registered.</p>
          ) : null}
        </div>
      </Panel>

      {returnableAllocations.length > 0 ? (
        <Panel className="mt-6">
          <h2 className="font-display text-xl font-semibold">
            {canManage ? "Active allocations" : "My active allocations"}
          </h2>
          <div className="mt-5 grid gap-4">
            {returnableAllocations.map((allocation) => (
              <form
                key={allocation._id}
                action={returnAssetAction}
                className="grid gap-3 border-b border-white/10 pb-4 min-[760px]:grid-cols-[1fr_220px_auto]"
              >
                <input type="hidden" name="allocation" value={allocation._id} />
                <p className="text-sm text-[#8B98B4]">
                  {allocation.asset?.assetTag} · Expected return{" "}
                  {allocation.expectedReturnDate
                    ? new Date(allocation.expectedReturnDate).toLocaleDateString()
                    : "not set"}
                </p>
                <TextField name="conditionNotes" label="Check-in notes" />
                <div className="self-end">
                  <SubmitButton>Return</SubmitButton>
                </div>
              </form>
            ))}
          </div>
        </Panel>
      ) : null}
    </>
  );
}
