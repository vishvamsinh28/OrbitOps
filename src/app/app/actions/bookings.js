"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import Asset from "@/models/Asset";
import Booking from "@/models/Booking";
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

  const asset = await Asset.findById(assetId);
  if (!asset?.isBookable) return;

  const overlap = await Booking.findOne({
    asset: assetId,
    status: { $ne: "Cancelled" },
    start: { $lt: end },
    end: { $gt: start },
  });

  if (overlap) return;

  const booking = await Booking.create({
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
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status === "Cancelled" || booking.status === "Completed") {
    return;
  }

  const isOwner = booking.bookedBy.toString() === user._id;
  const isManager = canManageAssets(user.role);
  if (!isOwner && !isManager) return;

  booking.status = "Cancelled";
  await booking.save();

  await logActivity({
    actor: user._id,
    action: "Booking cancelled",
    entityType: "Booking",
    entityId: booking._id,
    description: `Cancelled booking for ${
      (await Asset.findById(booking.asset))?.assetTag || "unknown"
    }.`,
  });

  revalidatePath("/app/bookings");
  revalidatePath("/app/dashboard");
}
