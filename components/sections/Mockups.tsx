import { cn } from "@/lib/utils";

/**
 * Renders the generated product-preview image for a demo industry.
 * Files live in `public/assets/<slug>-preview.webp` (1536×1024).
 */
export function Mockup({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <img
      src={`/assets/${slug}-preview.webp`}
      alt=""
      width={1536}
      height={1024}
      loading="lazy"
      decoding="async"
      className={cn(
        "block w-full rounded-xl border border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_24px_48px_-26px_rgba(0,0,0,0.9)]",
        className,
      )}
    />
  );
}
