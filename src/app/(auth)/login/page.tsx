import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "./login-form";
import { authOptions } from "@/lib/auth";
import { safeAuthCallbackUrl } from "@/lib/auth-callback-url";

const DEFAULT_CALLBACK = "/dashboard";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const q = await searchParams;
  const callbackUrl = safeAuthCallbackUrl(q.callbackUrl, DEFAULT_CALLBACK);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}
