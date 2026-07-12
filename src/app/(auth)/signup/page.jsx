import Link from "next/link";
import { AuthForm } from "../AuthForm";
import { signupAction } from "../actions";
import { connectDB } from "@/lib/db";
import { listOrganizations } from "@/lib/data";

export default async function SignupPage() {
  await connectDB();
  const organizations = await listOrganizations();

  return (
    <AuthForm
      title="Create your employee account"
      subtitle="Signup always starts as Employee. Admins can promote roles later."
      action={signupAction}
      submitLabel="Create account"
      includeName
      organizationOptions={organizations}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-[#4FD1E8]">
            Log in
          </Link>
          . First install?{" "}
          <Link href="/setup" className="text-[#4FD1E8]">
            Run setup
          </Link>
        </>
      }
    />
  );
}
