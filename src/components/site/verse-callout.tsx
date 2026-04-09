import { cn } from "@/lib/utils";

export function VerseCallout({
  quote,
  reference,
  translation = "WEB",
  className,
}: {
  quote: string;
  reference: string;
  translation?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-xl border border-border/80 bg-card/60 px-6 py-5 sm:px-8 sm:py-6",
        className,
      )}
    >
      <blockquote className="font-heading text-lg font-medium leading-relaxed text-foreground sm:text-xl">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {reference} ({translation})
      </figcaption>
    </figure>
  );
}
