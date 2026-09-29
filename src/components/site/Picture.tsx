import type { ImgHTMLAttributes } from "react";

import { images, type ImageName } from "@/lib/images.gen";

const srcSet = (name: ImageName) =>
  images[name].widths.map((w) => `/assets/${name}-${w}.webp ${w}w`).join(", ");

const largest = (name: ImageName) => {
  const { widths } = images[name];
  return `/assets/${name}-${widths[widths.length - 1]}.webp`;
};

/**
 * Responsive image for the assets in scripts/assets/manifest.json.
 * `phone` swaps in a different image below the tablet breakpoint (art direction).
 */
export function Picture({
  name,
  phone,
  alt,
  sizes,
  priority,
  className,
  ...rest
}: {
  name: ImageName;
  phone?: ImageName;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes" | "alt">) {
  const { width, height } = images[name];
  return (
    <picture>
      {phone && <source media="(max-width: 809.98px)" srcSet={srcSet(phone)} sizes={sizes} />}
      <img
        src={largest(name)}
        srcSet={srcSet(name)}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={className}
        {...rest}
      />
    </picture>
  );
}
