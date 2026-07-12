import Link from "next/link";
import { AuthForm } from "../AuthForm";
import { loginAction } from "../actions";

export default function LoginPage() {
  return (
    <AuthForm
      title="Log in to OrbitOps"
      subtitle="Use your employee email and password."
      action={loginAction}
      submitLabel="Log in"
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-[#4FD1E8]">
            Create an employee account
          </Link>
          {" · "}
          <Link href="/forgot-password" className="text-[#4FD1E8]">
            Forgot password?
          </Link>
        </>
      }
    />
  );
}
