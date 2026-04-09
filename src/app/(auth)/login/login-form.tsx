"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { SiteBrandLink } from "@/components/site/site-logo";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = res.url ?? callbackUrl;
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-4">
        <SiteBrandLink href="/" className="mx-auto w-fit" logoSize={40} />
        <p className="text-sm">
          <Link
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
            href="/"
          >
            ← Back to website
          </Link>
        </p>

        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use your email and password to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="text-foreground underline underline-offset-4" href="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
