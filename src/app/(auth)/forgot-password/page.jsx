import Link from "next/link";
import { AuthForm } from "../AuthForm";
import { forgotPasswordAction } from "../actions";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Reset access"
      subtitle="Enter your employee email and an Admin will be notified."
      action={forgotPasswordAction}
      submitLabel="Request reset"
      includePassword={false}
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-[#4FD1E8]">
            Back to login
          </Link>
        </>
      }
    />
  );
}
