import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  allocateAssetAction,
  registerAssetAction,
  returnAssetAction,
} from "../actions/assets";
import { AssetFilter } from "../components/AssetFilter";
import { canManageAssets, requireUser } from "@/lib/auth";
import { listAssetsData } from "@/lib/data";

async function getAssetsData() {
  return listAssetsData();
}

export default async function AssetsPage() {
  const user = await requireUser();
  const canManage = canManageAssets(user.role);
  const { assets, categories, departments, users, allocations } =
    await getAssetsData();

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

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Asset directory
        </h2>
        <div className="mt-5">
          <AssetFilter assets={assets} categories={categories} canManage={canManage} />
        </div>
      </Panel>

      {canManage && allocations.length > 0 ? (
        <Panel className="mt-6">
          <h2 className="font-display text-xl font-semibold">
            Active allocations
          </h2>
          <div className="mt-5 grid gap-4">
            {allocations.map((allocation) => (
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
