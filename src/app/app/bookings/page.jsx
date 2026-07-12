import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import {
  cancelBookingAction,
  createBookingAction,
  rescheduleBookingAction,
} from "../actions/bookings";
import { canManageAssets, requireUser } from "@/lib/auth";
import { listBookingData } from "@/lib/data";

async function getBookingData(organizationId) {
  return listBookingData(organizationId);
}

export default async function BookingsPage() {
  const user = await requireUser();
  const { resources, bookings } = await getBookingData(user.organization?._id);
  const canCancelAll = canManageAssets(user.role);

  return (
    <>
      <PageHeader eyebrow="Resource booking" title="Bookings">
        Create reservations with PostgreSQL overlap validation.
      </PageHeader>

      <div className="grid gap-6 min-[961px]:grid-cols-[0.7fr_1fr]">
        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Book a resource
          </h2>
          <form action={createBookingAction} className="mt-5 grid gap-4">
            <SelectField name="asset" label="Bookable resource" required>
              <option value="">Select resource</option>
              {resources.map((resource) => (
                <option key={resource._id} value={resource._id}>
                  {resource.assetTag} — {resource.name}
                </option>
              ))}
            </SelectField>
            <TextField name="start" label="Start" type="datetime-local" required />
            <TextField name="end" label="End" type="datetime-local" required />
            <TextField name="purpose" label="Purpose" />
            <SubmitButton>Create booking</SubmitButton>
          </form>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl font-semibold">
            Booking calendar
          </h2>
          <div className="mt-5 grid gap-4">
            {bookings.map((booking) => {
              const canCancel = canCancelAll || booking.bookedBy?._id === user._id;
              const isCancellable = booking.status === "Upcoming" || booking.status === "Ongoing";
              const startValue = new Date(booking.start).toISOString().slice(0, 16);
              const endValue = new Date(booking.end).toISOString().slice(0, 16);
              return (
                <article key={booking._id} className="border-b border-white/10 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {booking.asset?.assetTag} — {booking.asset?.name}
                      </p>
                      <p className="text-sm text-[#8B98B4]">
                        {new Date(booking.start).toLocaleString()} to{" "}
                        {new Date(booking.end).toLocaleString()} · {booking.status}
                      </p>
                      <p className="text-sm text-[#586180]">
                        {booking.purpose || "No purpose"} · {booking.bookedBy?.name}
                      </p>
                    </div>
                    {canCancel && isCancellable ? (
                      <div className="grid gap-2">
                        <form action={cancelBookingAction}>
                          <input type="hidden" name="booking" value={booking._id} />
                          <SubmitButton>Cancel</SubmitButton>
                        </form>
                      </div>
                    ) : null}
                  </div>
                  {canCancel && isCancellable ? (
                    <form
                      action={rescheduleBookingAction}
                      className="mt-4 grid gap-3 min-[760px]:grid-cols-[1fr_1fr_auto]"
                    >
                      <input type="hidden" name="booking" value={booking._id} />
                      <TextField
                        name="start"
                        label="New start"
                        type="datetime-local"
                        defaultValue={startValue}
                        required
                      />
                      <TextField
                        name="end"
                        label="New end"
                        type="datetime-local"
                        defaultValue={endValue}
                        required
                      />
                      <div className="self-end">
                        <SubmitButton>Reschedule</SubmitButton>
                      </div>
                    </form>
                  ) : null}
                </article>
              );
            })}
            {bookings.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No bookings yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
