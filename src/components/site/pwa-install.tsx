"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    /iPad|iPhone|iPod/u.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function useDeferredInstallPrompt(): [
  BeforeInstallPromptEvent | null,
  () => void,
] {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = useCallback(() => setDeferred(null), []);

  return [deferred, dismiss];
}

function InstallButton({
  deferred,
  onDone,
}: {
  deferred: BeforeInstallPromptEvent;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    setBusy(true);
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      onDone();
      setBusy(false);
    }
  }, [deferred, onDone]);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
    >
      {busy ? "Opening installer…" : "Add to Home Screen"}
    </button>
  );
}

function IosSteps() {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-left text-sm text-muted-foreground">
      <p className="font-medium text-foreground">On iPhone or iPad (Safari)</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>Tap the Share button in the toolbar.</li>
        <li>Scroll the sheet and tap Add to Home Screen.</li>
        <li>Confirm the name, then tap Add.</li>
      </ol>
      <p className="mt-3 text-xs">
        Apple does not expose the same one-tap install button that Chrome and
        Edge can show on Android and desktop.
      </p>
    </div>
  );
}

function FallbackHint() {
  return (
    <p className="text-sm text-muted-foreground">
      If you use Chrome or Edge, look for an install icon in the address bar or
      choose Install app from the browser menu. Our{" "}
      <Link href="/blog/install-pwa-home-screen" className="text-primary hover:underline">
        PWA guide
      </Link>{" "}
      walks through each platform.
    </p>
  );
}

function SharedInstallBody({
  variant,
}: {
  variant: "promo" | "callout";
}) {
  const [deferred, dismissDeferred] = useDeferredInstallPrompt();

  if (isStandalone()) {
    return (
      <p className="text-sm text-muted-foreground">
        You are already using the site in an installed window. Open this page
        in the browser if you need the full tab experience.
      </p>
    );
  }

  if (isIos()) {
    return <IosSteps />;
  }

  if (deferred) {
    return (
      <div
        className={
          variant === "promo"
            ? "flex flex-col items-stretch gap-3 sm:items-start"
            : "flex flex-col gap-3"
        }
      >
        <InstallButton deferred={deferred} onDone={dismissDeferred} />
        <p className="text-xs text-muted-foreground">
          Your browser will show its own install dialog. You can dismiss it and
          try again from here.
        </p>
      </div>
    );
  }

  return <FallbackHint />;
}

/** Homepage promo section content (used inside a server-rendered layout). */
export function PwaHomeInstallBlock() {
  return <SharedInstallBody variant="promo" />;
}

/** MDX embed: interactive install hints inside a blog post. */
export function PwaInstallCallout() {
  return (
    <div className="not-prose my-8 rounded-xl border border-primary/25 bg-primary/5 p-6">
      <p className="text-sm font-medium text-foreground">Try install from here</p>
      <p className="mt-2 text-sm text-muted-foreground">
        When your browser supports it, the button below triggers the system
        install flow. Otherwise you will see steps or a link to the full guide.
      </p>
      <div className="mt-4">
        <SharedInstallBody variant="callout" />
      </div>
    </div>
  );
}
