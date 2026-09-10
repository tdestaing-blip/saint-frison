import imageUrlBuilder from "@sanity/image-url";
import type { Media } from "@/lib/types";
export function Photo({
  media,
  className = "",
  priority = false,
  fullView = false,
  sizes = "(max-width: 800px) 100vw, 50vw",
}: {
  media: Media;
  className?: string;
  priority?: boolean;
  fullView?: boolean;
  sizes?: string;
}) {
  const local = media.src.match(/^\/images\/(\d+)-1440.webp$/);
  const builder =
    media.asset && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      ? imageUrlBuilder({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        }).image(fullView ? { asset: media.asset } : media)
      : null;
  return (
    <img
      className={className}
      src={builder ? builder.width(1440).auto("format").url() : media.src}
      srcSet={
        local
          ? `/images/${local[1]}-640.webp 640w, /images/${local[1]}-1440.webp 1440w, /images/${local[1]}-2200.webp 2200w`
          : builder
            ? `${builder.width(640).auto("format").url()} 640w, ${builder.width(1440).auto("format").url()} 1440w, ${builder.width(2200).auto("format").url()} 2200w`
            : undefined
      }
      sizes={sizes}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={
        !fullView && media.hotspot
          ? {
              objectPosition: `${media.hotspot.x * 100}% ${media.hotspot.y * 100}%`,
            }
          : undefined
      }
    />
  );
}
