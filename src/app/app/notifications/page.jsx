import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { markNotificationReadAction } from "../actions/notifications";
import { requireUser } from "@/lib/auth";
import { listActivityLogs, listNotifications } from "@/lib/data";

export default async function NotificationsPage() {
  const user = await requireUser();
  const [notifications, activityLogs] = await Promise.all([
    listNotifications(user._id),
    listActivityLogs(user.organization?._id),
  ]);
  const serialized = JSON.parse(JSON.stringify(notifications));

  return (
    <>
      <PageHeader eyebrow="Inbox" title="Notifications">
        Review assignments, approvals, requests, and status changes.
      </PageHeader>

      <div className="grid gap-6 min-[1100px]:grid-cols-[0.7fr_1fr]">
        <Panel>
          <h2 className="font-display text-xl font-semibold">Inbox</h2>
          <div className="mt-5 grid gap-4">
            {serialized.map((notification) => (
              <form
                key={notification._id}
                action={markNotificationReadAction}
                className="grid gap-3 border-b border-white/10 pb-4 min-[760px]:grid-cols-[1fr_auto]"
              >
                <input
                  type="hidden"
                  name="notification"
                  value={notification._id}
                />
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-[#8B98B4]">
                    {notification.message || "No details"}
                  </p>
                </div>
                {notification.readAt ? (
                  <span className="font-mono text-xs text-[#586180]">Read</span>
                ) : (
                  <button className="rounded-md border border-white/10 px-3 py-2 font-mono text-xs">
                    Mark read
                  </button>
                )}
              </form>
            ))}
            {serialized.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No notifications yet.</p>
            ) : null}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">Activity log</h2>
          <div className="mt-5 grid gap-4">
            {activityLogs.map((log) => (
              <article key={log._id} className="border-b border-white/10 pb-4">
                <p className="font-medium">{log.description}</p>
                <p className="text-sm text-[#8B98B4]">
                  {log.action} · {log.actor?.name || "System"} ·{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
            {activityLogs.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No activity yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
