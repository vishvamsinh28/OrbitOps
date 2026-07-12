"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { createUser, getUserByEmail, listAdminUsers } from "@/lib/data";
import { hashPassword, verifyPassword } from "@/lib/password";
import { setSession } from "@/lib/session";
import { logActivity, notifyUser } from "@/lib/activity";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function signupAction(_prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");
  const organizationId = String(formData.get("organizationId") || "").trim();

  if (!name || !email || !organizationId || password.length < 8) {
    return {
      error:
        "Enter a name, organization, email, and password with at least 8 characters.",
    };
  }

  await connectDB();

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "That email is already registered." };

  const user = await createUser({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "Employee",
    organizationId,
  });

  await logActivity({
    organization: organizationId,
    actor: user._id,
    action: "Signup",
    entityType: "User",
    entityId: user._id,
    description: `${name} created an account.`,
  });

  await setSession(user._id);
  redirect("/app/dashboard");
}

export async function loginAction(_prevState, formData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  await connectDB();

  const user = await getUserByEmail(email);
  const validPassword =
    user && (await verifyPassword(password, user.passwordHash));

  if (!user || !validPassword || user.status !== "Active") {
    return { error: "Invalid email or password." };
  }

  await logActivity({
    actor: user._id,
    action: "Login",
    entityType: "User",
    entityId: user._id,
    description: `${user.name} logged in.`,
  });

  await setSession(user._id);
  redirect("/app/dashboard");
}

export async function forgotPasswordAction(_prevState, formData) {
  const email = normalizeEmail(formData.get("email"));

  if (!email) return { error: "Enter your employee email." };

  await connectDB();

  const user = await getUserByEmail(email);

  if (user) {
    const admins = await listAdminUsers(user.organization?._id || user.organizationId);

    await Promise.all(
      admins.map((admin) =>
        notifyUser({
          user: admin._id,
          organization: user.organization?._id || user.organizationId,
          title: "Password reset requested",
          message: `${user.name} requested help resetting their password.`,
          href: "/app/admin",
        }),
      ),
    );

    await logActivity({
      actor: user._id,
      action: "Password reset requested",
      entityType: "User",
      entityId: user._id,
      description: `${user.name} requested a password reset.`,
    });
  }

  return {
    message:
      "If that email belongs to an active employee, an Admin has been notified.",
  };
}
