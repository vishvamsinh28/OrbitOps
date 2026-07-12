"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  bookingOverlaps,
  cancelBooking,
  createBooking,
  getAssetById,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

export async function createBookingAction(formData) {
  const user = await requireUser();
  await connectDB();

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

  const asset = await getAssetById(assetId);
  if (!asset?.isBookable) return;

  const overlap = await bookingOverlaps({ asset: assetId, start, end });

  if (overlap) return;

  const booking = await createBooking({
    asset: assetId,
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

  const bookingId = value(formData, "booking");
  const booking = await cancelBooking({
    bookingId,
    userId: user._id,
    isManager: canManageAssets(user.role),
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
