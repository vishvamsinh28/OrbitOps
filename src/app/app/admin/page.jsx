import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  createCategoryAction,
  createDepartmentAction,
  updateEmployeeAction,
} from "../actions/org";
import { requireRole, ROLES } from "@/lib/auth";
import { listAdminData } from "@/lib/data";

async function getAdminData() {
  return listAdminData();
}

export default async function AdminPage() {
  await requireRole([ROLES.ADMIN]);
  const { departments, categories, users } = await getAdminData();

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
            <SubmitButton>Create category</SubmitButton>
          </form>
        </Panel>
      </div>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Employee directory
        </h2>
        <div className="mt-5 grid gap-4">
          {users.map((employee) => (
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
              <SelectField name="role" label="Role" defaultValue={employee.role}>
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </SelectField>
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
              <div className="self-end">
                <SubmitButton>Save</SubmitButton>
              </div>
            </form>
          ))}
        </div>
      </Panel>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">Current setup</h2>
        <div className="mt-4 grid gap-4 min-[760px]:grid-cols-2">
          <p className="text-sm text-[#8B98B4]">
            Departments: {departments.map((item) => item.name).join(", ") || "none"}
          </p>
          <p className="text-sm text-[#8B98B4]">
            Categories: {categories.map((item) => item.name).join(", ") || "none"}
          </p>
        </div>
      </Panel>
    </>
  );
}
