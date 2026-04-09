"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { SiteBrandLink } from "@/components/site/site-logo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined, email, password }),
    });

    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      setLoading(false);
      setError(json?.error ?? "Registration failed.");
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/notes",
    });

    setLoading(false);

    if (!signInRes || signInRes.error) {
      window.location.href = "/login";
      return;
    }

    window.location.href = signInRes.url ?? "/notes";
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-4">
        <SiteBrandLink href="/" className="mx-auto w-fit" logoSize={40} />
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm">
            <Link
              className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
              href="/"
            >
              ← Back to website
            </Link>
          </p>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register with email and password.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-foreground underline underline-offset-4" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

