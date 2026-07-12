"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import {
  createInitialOrganizationAdmin,
  getUserByEmail,
} from "@/lib/data";
import { hashPassword } from "@/lib/password";
import { setSession } from "@/lib/session";
import { logActivity } from "@/lib/activity";

export async function createFirstAdminAction(_prevState, formData) {
  const organizationName = String(formData.get("organizationName") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!organizationName || !name || !email || password.length < 8) {
    return {
      error:
        "Enter an organization, name, email, and password with at least 8 characters.",
    };
  }

  await connectDB();

  if (await getUserByEmail(email)) {
    return { error: "That email is already registered." };
  }

  let setup;
  try {
    setup = await createInitialOrganizationAdmin({
      organizationName,
      name,
      email,
      passwordHash: await hashPassword(password),
    });
  } catch (error) {
    if (error?.code === "23505") {
      return { error: "That email is already registered." };
    }

    throw error;
  }

  const { organization, admin } = setup;

  await logActivity({
    organization: organization._id,
    actor: admin._id,
    action: "Organization admin created",
    entityType: "User",
    entityId: admin._id,
    description: `${name} created ${organization.name}.`,
  });

  await setSession(admin._id);
  redirect("/app/dashboard");
}
