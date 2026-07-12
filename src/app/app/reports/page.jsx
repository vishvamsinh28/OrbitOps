import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { requireRole, ROLES } from "@/lib/auth";
import { listReportsData } from "@/lib/data";

function csvDataUri(rows) {
  if (!rows.length) return "data:text/csv;charset=utf-8,";
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ];
  return `data:text/csv;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`;
}

function MetricList({ title, rows, render }) {
  return (
    <Panel>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-3">
        {rows.map((row, index) => (
          <article key={`${title}-${index}`} className="border-b border-white/10 pb-3">
            {render(row)}
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-[#8B98B4]">No data yet.</p>
        ) : null}
      </div>
    </Panel>
  );
}

export default async function ReportsPage() {
  const user = await requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]);
  const reports = await listReportsData(user.organization?._id);
  const exportRows = [
    ...reports.statusBreakdown.map((row) => ({
      report: "Status breakdown",
      label: row.status,
      value: row.count,
    })),
    ...reports.departmentAllocations.map((row) => ({
      report: "Department allocations",
      label: row.department,
      value: row.count,
    })),
    ...reports.maintenanceFrequency.map((row) => ({
      report: "Maintenance frequency",
      label: row.category,
      value: row.count,
    })),
    ...reports.bookingHeatmap.map((row) => ({
      report: "Booking heatmap",
      label: `${row.hour}:00`,
      value: row.count,
    })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Analytics"
        action={
          <a
            href={csvDataUri(exportRows)}
            download="orbitops-reports.csv"
            className="rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-[#E9EDF6]"
          >
            Export CSV
          </a>
        }
      >
        Utilization, maintenance, allocation, and booking trends.
      </PageHeader>

      <div className="grid gap-6 min-[1100px]:grid-cols-2">
        <MetricList
          title="Asset status"
          rows={reports.statusBreakdown}
          render={(row) => (
            <>
              <p className="font-medium">{row.status}</p>
              <p className="text-sm text-[#8B98B4]">{row.count} assets</p>
            </>
          )}
        />

        <MetricList
          title="Department allocation"
          rows={reports.departmentAllocations}
          render={(row) => (
            <>
              <p className="font-medium">{row.department}</p>
              <p className="text-sm text-[#8B98B4]">{row.count} assets</p>
            </>
          )}
        />

        <MetricList
          title="Most-used resources"
          rows={reports.mostUsedAssets}
          render={(row) => (
            <>
              <p className="font-medium">
                {row.assetTag} — {row.name}
              </p>
              <p className="text-sm text-[#8B98B4]">{row.bookingCount} bookings</p>
            </>
          )}
        />

        <MetricList
          title="Idle assets"
          rows={reports.idleAssets}
          render={(row) => (
            <>
              <p className="font-medium">
                {row.assetTag} — {row.name}
              </p>
              <p className="text-sm text-[#8B98B4]">
                {row.status} · {row.location || "No location"}
              </p>
            </>
          )}
        />

        <MetricList
          title="Maintenance frequency"
          rows={reports.maintenanceFrequency}
          render={(row) => (
            <>
              <p className="font-medium">{row.category}</p>
              <p className="text-sm text-[#8B98B4]">{row.count} requests</p>
            </>
          )}
        />

        <MetricList
          title="Booking heatmap"
          rows={reports.bookingHeatmap}
          render={(row) => (
            <>
              <p className="font-medium">{row.hour}:00</p>
              <p className="text-sm text-[#8B98B4]">{row.count} bookings started</p>
            </>
          )}
        />
      </div>

      <Panel className="mt-6">
        <h2 className="font-display text-xl font-semibold">
          Due for maintenance or retirement
        </h2>
        <div className="mt-5 grid gap-4">
          {reports.dueForMaintenance.map((asset) => (
            <article key={asset._id} className="border-b border-white/10 pb-4">
              <p className="font-medium">
                {asset.assetTag} — {asset.name}
              </p>
              <p className="text-sm text-[#8B98B4]">
                {asset.status} · {asset.condition}
                {asset.acquisitionDate
                  ? ` · Acquired ${new Date(asset.acquisitionDate).toLocaleDateString()}`
                  : ""}
              </p>
            </article>
          ))}
          {reports.dueForMaintenance.length === 0 ? (
            <p className="text-sm text-[#8B98B4]">No assets flagged.</p>
          ) : null}
        </div>
      </Panel>
    </>
  );
}
