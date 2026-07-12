import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { SelectField, SubmitButton, TextField } from "../components/FormControls";
import { createBookingAction } from "../actions/bookings";
import { connectDB } from "@/lib/db";
import Asset from "@/models/Asset";
import Booking from "@/models/Booking";

async function getBookingData() {
  await connectDB();

  const [resources, bookings] = await Promise.all([
    Asset.find({ isBookable: true }).sort({ name: 1 }).lean(),
    Booking.find()
      .sort({ start: 1 })
      .populate("asset", "name assetTag")
      .populate("bookedBy", "name")
      .lean(),
  ]);

  return JSON.parse(JSON.stringify({ resources, bookings }));
}

export default async function BookingsPage() {
  const { resources, bookings } = await getBookingData();

  return (
    <>
      <PageHeader eyebrow="Resource booking" title="Bookings">
        Create reservations with MongoDB overlap validation.
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
            {bookings.map((booking) => (
              <article key={booking._id} className="border-b border-white/10 pb-4">
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
              </article>
            ))}
            {bookings.length === 0 ? (
              <p className="text-sm text-[#8B98B4]">No bookings yet.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
