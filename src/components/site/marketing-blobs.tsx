import { cn } from "@/lib/utils";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
  }
  return Math.abs(h);
}

/**
 * Seeded diameter scale. Base (mobile) stays ≤18rem so edges + blur do not
 * force page-wide horizontal scroll; large tiers grow from `sm` → `lg` → `xl`.
 */
const BLOB_SIZES = [
  "h-48 w-48 sm:h-52 sm:w-52",
  "h-52 w-52 sm:h-56 sm:w-56",
  "h-56 w-56 sm:h-64 sm:w-64",
  "h-64 w-64 sm:h-72 sm:w-72",
  "h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80",
  "h-72 w-72 sm:h-80 sm:w-80",
  "h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96",
  "h-72 w-72 sm:h-96 sm:w-96 lg:h-[24rem] lg:w-[24rem]",
  "h-72 w-72 sm:h-96 sm:w-96 lg:h-[26rem] lg:w-[26rem]",
  "h-72 w-72 sm:h-96 sm:w-96 xl:h-[28rem] xl:w-[28rem]",
  "h-72 w-72 sm:h-80 sm:w-80 lg:h-[28rem] lg:w-[28rem] xl:h-[30rem] xl:w-[30rem]",
  "h-72 w-72 sm:h-96 sm:w-96 lg:h-[30rem] lg:w-[30rem] xl:h-[32rem] xl:w-[32rem]",
] as const;

/** Placement + blur only; size comes from `BLOB_SIZES[hash % len]`. */
const BLOB_POSITIONS = [
  "left-[12%] top-[-16%] -translate-x-1/2 blur-3xl",
  "left-[88%] bottom-[-20%] -translate-x-1/2 blur-[52px]",
  "left-[22%] top-[38%] -translate-x-1/2 blur-3xl",
  "left-[78%] top-[-12%] -translate-x-1/2 blur-3xl",
  "left-[8%] bottom-[-10%] -translate-x-1/2 blur-[48px]",
  "left-[92%] top-[28%] -translate-x-1/2 blur-3xl",
  "left-[36%] top-[-12%] -translate-x-1/2 blur-[56px]",
  "left-[70%] bottom-[-22%] -translate-x-1/2 blur-3xl",
  "left-[16%] top-[52%] -translate-x-1/2 blur-[54px]",
  "left-[62%] bottom-[-14%] -translate-x-1/2 blur-3xl",
  "left-[42%] top-[14%] -translate-x-1/2 blur-3xl",
  "left-[52%] bottom-[-8%] -translate-x-1/2 blur-[50px]",
  "left-[6%] top-[18%] -translate-x-1/2 blur-3xl",
  "left-[94%] bottom-[-18%] -translate-x-1/2 blur-3xl",
] as const;

const TONE_PRIMARY = "bg-primary/30";
const TONE_DESTRUCTIVE = "bg-destructive/22";

export function MarketingBlobs({ seed }: { seed: string }) {
  const pi = hashSeed(seed) % BLOB_POSITIONS.length;
  const si = hashSeed(`${seed}:size`) % BLOB_SIZES.length;
  const warmPrimary = hashSeed(`${seed}:tone`) % 2 === 0;
  const position = BLOB_POSITIONS[pi]!;
  const size = BLOB_SIZES[si]!;
  const tone = warmPrimary ? TONE_PRIMARY : TONE_DESTRUCTIVE;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className={cn(
          "pointer-events-none absolute rounded-full",
          tone,
          position,
          size,
        )}
        aria-hidden
      />
    </div>
  );
}

/**
 * One glow source per section; vertical inset lets blur soften into neighbors.
 */
export function MarketingBlobBackdrop({ seed }: { seed: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[-9rem] bottom-[-9rem] z-0"
      aria-hidden
    >
      <div className="absolute inset-0 min-h-[16rem]">
        <MarketingBlobs seed={seed} />
      </div>
    </div>
  );
}
