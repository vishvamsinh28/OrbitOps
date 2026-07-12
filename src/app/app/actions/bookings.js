"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  bookingOverlaps,
  cancelBooking,
  createBooking,
  getBookingById,
  getAssetById,
  rescheduleBooking,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

export async function createBookingAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const assetId = value(formData, "asset");
  const start = new Date(value(formData, "start"));
  const end = new Date(value(formData, "end"));

  if (
    !assetId ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    return;
  }

  const asset = await getAssetById(assetId, organizationId);
  if (!asset?.isBookable) return;

  const overlap = await bookingOverlaps({ asset: assetId, start, end, organizationId });

  if (overlap) return;

  const booking = await createBooking({
    asset: assetId,
    organizationId,
    bookedBy: user._id,
    start,
    end,
    purpose: value(formData, "purpose"),
  });

  await logActivity({
    actor: user._id,
    action: "Booking created",
    entityType: "Booking",
    entityId: booking._id,
    description: `Booked ${asset.assetTag}.`,
  });

  revalidatePath("/app/bookings");
  revalidatePath("/app/dashboard");
}

export async function cancelBookingAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const bookingId = value(formData, "booking");
  const booking = await cancelBooking({
    bookingId,
    userId: user._id,
    isManager: canManageAssets(user.role),
    organizationId,
  });
  if (!booking) return;

  await logActivity({
    actor: user._id,
    action: "Booking cancelled",
    entityType: "Booking",
    entityId: booking._id,
    description: `Cancelled booking for ${booking.assetTag || "unknown"}.`,
  });

  revalidatePath("/app/bookings");
  revalidatePath("/app/dashboard");
}

export async function rescheduleBookingAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const bookingId = value(formData, "booking");
  const start = new Date(value(formData, "start"));
  const end = new Date(value(formData, "end"));

  if (
    !bookingId ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    return;
  }

  const booking = await getBookingById(bookingId, organizationId);
  const isManager = canManageAssets(user.role);
  if (!booking || (!isManager && booking.bookedBy !== user._id)) return;

  const overlap = await bookingOverlaps({
    asset: booking.asset,
    start,
    end,
    exceptBooking: bookingId,
    organizationId,
  });

  if (overlap) return;

  const updated = await rescheduleBooking({
    bookingId,
    userId: user._id,
    isManager,
    start,
    end,
    organizationId,
  });
  if (!updated) return;

  await logActivity({
    actor: user._id,
    action: "Booking rescheduled",
    entityType: "Booking",
    entityId: updated._id,
    description: `Rescheduled booking for ${updated.assetTag || "unknown"}.`,
  });

  revalidatePath("/app/bookings");
  revalidatePath("/app/dashboard");
}
