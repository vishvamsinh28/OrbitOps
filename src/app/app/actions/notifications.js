"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { markNotificationRead } from "@/lib/data";
import { value } from "./shared";

export async function markNotificationReadAction(formData) {
  const user = await requireUser();
  await connectDB();

  await markNotificationRead({
    notificationId: value(formData, "notification"),
    userId: user._id,
  });

  revalidatePath("/app/notifications");
}
