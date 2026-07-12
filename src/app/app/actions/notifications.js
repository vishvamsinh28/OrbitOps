"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { value } from "./shared";

export async function markNotificationReadAction(formData) {
  const user = await requireUser();
  await connectDB();

  await Notification.updateOne(
    { _id: value(formData, "notification"), user: user._id },
    { readAt: new Date() },
  );

  revalidatePath("/app/notifications");
}
