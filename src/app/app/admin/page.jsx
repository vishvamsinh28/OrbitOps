import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  createCategoryAction,
  createDepartmentAction,
  updateCategoryAction,
  updateDepartmentAction,
  updateEmployeeAction,
} from "../actions/org";
import { requireRole, ROLES } from "@/lib/auth";
import { listAdminData } from "@/lib/data";

async function getAdminData(organizationId) {
  return listAdminData(organizationId);
}

export default async function AdminPage() {
  const user = await requireRole([ROLES.ADMIN]);
  const { departments, categories, users } = await getAdminData(
    user.organization?._id,
  );

  return (
    <>
      <PageHeader eyebrow="Organization setup" title="Admin">
        Manage departments, asset categories, and employee access.
      </PageHeader>

      <div className="grid gap-6 min-[1100px]:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Create department
          </h2>
          <form action={createDepartmentAction} className="mt-5 grid gap-4">
            <TextField name="name" label="Department name" required />
            <SelectField name="parent" label="Parent department">
              <option value="">No parent</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </SelectField>
            <SelectField name="head" label="Department head">
              <option value="">No head yet</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </SelectField>
            <SubmitButton>Create department</SubmitButton>
          </form>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Create asset category
          </h2>
          <form action={createCategoryAction} className="mt-5 grid gap-4">
            <TextField name="name" label="Category name" required />
            <TextField
              name="customFields"
              label="Custom fields"
              placeholder="Warranty period, VIN, Floor"
            />
            <SubmitButton>Create category</SubmitButton>
          </form>
        </Panel>
      </div>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Employee directory
        </h2>
        <div className="mt-5 grid gap-4">
          {users.map((employee) => {
            const isCurrentUser = employee._id === user._id;

            return (
              <form
                key={employee._id}
                action={updateEmployeeAction}
                className="grid gap-3 border-b border-white/10 pb-4 min-[900px]:grid-cols-[1fr_180px_180px_120px_auto]"
              >
                <input type="hidden" name="employeeId" value={employee._id} />
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-[#8B98B4]">{employee.email}</p>
                </div>
                {isCurrentUser ? (
                  <label className="grid gap-2 text-sm text-[#8B98B4]">
                    Role
                    <span className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220]/70 px-3 py-2.5 text-[#E9EDF6]">
                      {employee.role}
                    </span>
                  </label>
                ) : (
                  <SelectField name="role" label="Role" defaultValue={employee.role}>
                    {Object.values(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </SelectField>
                )}
                <SelectField
                  name="department"
                  label="Department"
                  defaultValue={employee.department?._id || ""}
                >
                  <option value="">None</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </SelectField>
                {isCurrentUser ? (
                  <label className="grid gap-2 text-sm text-[#8B98B4]">
                    Status
                    <span className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220]/70 px-3 py-2.5 text-[#E9EDF6]">
                      {employee.status}
                    </span>
                  </label>
                ) : (
                  <SelectField
                    name="status"
                    label="Status"
                    defaultValue={employee.status}
                  >
                    {["Active", "Inactive"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </SelectField>
                )}
                <div className="self-end">
                  <SubmitButton>Save</SubmitButton>
                </div>
              </form>
            );
          })}
        </div>
      </Panel>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Department management
        </h2>
        <div className="mt-5 grid gap-4">
          {departments.map((department) => (
            <form
              key={department._id}
              action={updateDepartmentAction}
              className="grid gap-3 border-b border-white/10 pb-4 min-[1000px]:grid-cols-[1fr_180px_180px_120px_auto]"
            >
              <input type="hidden" name="departmentId" value={department._id} />
              <TextField name="name" label="Name" defaultValue={department.name} required />
              <SelectField name="parent" label="Parent" defaultValue={department.parent?._id || ""}>
                <option value="">No parent</option>
                {departments
                  .filter((item) => item._id !== department._id)
                  .map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </SelectField>
              <SelectField name="head" label="Head" defaultValue={department.head?._id || ""}>
                <option value="">No head</option>
                {users.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </SelectField>
              <SelectField name="status" label="Status" defaultValue={department.status}>
                {["Active", "Inactive"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectField>
              <div className="self-end">
                <SubmitButton>Save</SubmitButton>
              </div>
            </form>
          ))}
        </div>
      </Panel>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Category management
        </h2>
        <div className="mt-5 grid gap-4">
          {categories.map((category) => (
            <form
              key={category._id}
              action={updateCategoryAction}
              className="grid gap-3 border-b border-white/10 pb-4 min-[900px]:grid-cols-[1fr_1fr_140px_auto]"
            >
              <input type="hidden" name="categoryId" value={category._id} />
              <TextField name="name" label="Name" defaultValue={category.name} required />
              <TextField
                name="customFields"
                label="Custom fields"
                defaultValue={(category.customFields || []).join(", ")}
              />
              <SelectField name="status" label="Status" defaultValue={category.status}>
                {["Active", "Inactive"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectField>
              <div className="self-end">
                <SubmitButton>Save</SubmitButton>
              </div>
            </form>
          ))}
        </div>
      </Panel>
    </>
  );
}
