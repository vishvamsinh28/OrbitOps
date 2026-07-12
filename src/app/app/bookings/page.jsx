import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
<<<<<<< HEAD
import { cancelBookingAction, createBookingAction } from "../actions/bookings";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Asset from "@/models/Asset";
import Booking from "@/models/Booking";
=======
import { createBookingAction } from "../actions/bookings";
import { listBookingData } from "@/lib/data";
>>>>>>> 39aa180 (chore: swithc to postgres)

async function getBookingData() {
  return listBookingData();
}

export default async function BookingsPage() {
  const user = await requireUser();
  const { resources, bookings } = await getBookingData();
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
            Booking list
          </h2>
          <div className="mt-5 grid gap-4">
            {bookings.map((booking) => {
              const canCancel = canCancelAll || booking.bookedBy?._id === user._id;
              const isCancellable = booking.status === "Upcoming" || booking.status === "Ongoing";
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
                      <form action={cancelBookingAction}>
                        <input type="hidden" name="booking" value={booking._id} />
                        <SubmitButton>Cancel</SubmitButton>
                      </form>
                    ) : null}
                  </div>
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
