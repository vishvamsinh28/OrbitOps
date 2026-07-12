"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { setSession } from "@/lib/session";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";

export async function createFirstAdminAction(_prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 8) {
    return {
      error: "Enter a name, email, and password with at least 8 characters.",
    };
  }

  await connectDB();

  const adminExists = await User.exists({ role: "Admin" });
  if (adminExists) return { error: "An Admin already exists." };

  const admin = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "Admin",
  });

  await logActivity({
    actor: admin._id,
    action: "Bootstrap admin created",
    entityType: "User",
    entityId: admin._id,
    description: `${name} created the first Admin account.`,
  });

  await setSession(admin._id);
  redirect("/app/dashboard");
}
