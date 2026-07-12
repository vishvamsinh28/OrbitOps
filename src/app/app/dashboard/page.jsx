import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { connectDB } from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import Allocation from "@/models/Allocation";
import Asset from "@/models/Asset";
import Booking from "@/models/Booking";
import MaintenanceRequest from "@/models/MaintenanceRequest";
import TransferRequest from "@/models/TransferRequest";
import { getQuickActions, requireUser } from "@/lib/auth";

async function getDashboardData() {
  await connectDB();

  const now = new Date();
  const [
    totalAssets,
    availableAssets,
    allocatedAssets,
    maintenanceAssets,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
    recentActivity,
  ] = await Promise.all([
    Asset.countDocuments(),
    Asset.countDocuments({ status: "Available" }),
    Asset.countDocuments({ status: "Allocated" }),
    Asset.countDocuments({ status: "Under Maintenance" }),
    Booking.countDocuments({
      status: { $in: ["Upcoming", "Ongoing"] },
      end: { $gte: now },
    }),
    TransferRequest.countDocuments({ status: "Requested" }),
    Allocation.countDocuments({
      status: "Active",
      expectedReturnDate: { $gte: now },
    }),
    Allocation.countDocuments({
      status: "Active",
      expectedReturnDate: { $lt: now },
    }),
    ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("actor", "name")
      .lean(),
  ]);

  return JSON.parse(
    JSON.stringify({
      stats: [
        ["Total assets", totalAssets],
        ["Available assets", availableAssets],
        ["Allocated assets", allocatedAssets],
        ["Under maintenance", maintenanceAssets],
        ["Active bookings", activeBookings],
        ["Pending transfers", pendingTransfers],
        ["Upcoming returns", upcomingReturns],
        ["Overdue returns", overdueReturns],
      ],
      recentActivity,
    }),
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const { stats, recentActivity } = await getDashboardData();
  const quickActions = getQuickActions(user.role);

  return (
    <>
      <PageHeader eyebrow="Command center" title="Dashboard">
        Operational pulse for assets, resources, returns, and requests.
      </PageHeader>

      <div className="grid gap-4 min-[640px]:grid-cols-2 min-[1180px]:grid-cols-4">
        {stats.map(([label, value]) => (
          <Panel key={label}>
            <p className="font-mono text-xs uppercase text-[#586180]">
              {label}
            </p>
            <strong className="mt-2 block font-display text-[34px]">
              {value}
            </strong>
          </Panel>
        ))}
      </div>

      <div className="mt-8 grid gap-6 min-[961px]:grid-cols-[0.7fr_1fr]">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Quick actions
          </h2>
          <div className="mt-5 grid gap-3">
            {quickActions.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="rounded-md border border-[rgba(148,168,210,0.16)] px-3 py-2 text-sm text-[#8B98B4] hover:text-[#E9EDF6]"
              >
                {label}
              </a>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Recent activity
          </h2>
          <div className="mt-5 grid gap-4">
            {recentActivity.map((log) => (
              <div key={log._id} className="border-b border-white/10 pb-3">
                <p className="text-sm text-[#E9EDF6]">{log.description}</p>
                <p className="mt-1 font-mono text-[11px] text-[#586180]">
                  {log.action} by {log.actor?.name || "System"}
                </p>
              </div>
            ))}
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No activity yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
