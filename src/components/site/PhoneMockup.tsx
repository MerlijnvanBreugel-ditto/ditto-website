import { Picture } from "@/components/site/Picture";
import type { ImageName } from "@/lib/images.gen";
import { cn } from "@/lib/utils";

/**
 * An app screenshot inside the iPhone frame (Framer "Variant 1" phone component,
 * 300×605 at full size). Give it a width; the height follows the frame's aspect ratio.
 */
export function PhoneMockup({
  screen,
  alt,
  sizes,
  className,
  screenClassName = "rounded-[24px]",
}: {
  screen: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <figure className={cn("relative aspect-[300/605]", className)}>
      <div
        className={cn(
          "absolute top-[1.5%] left-1/2 aspect-[0.461774] w-[90%] -translate-x-1/2 overflow-hidden",
          screenClassName,
        )}
      >
        <Picture name={screen} alt={alt} sizes={sizes} className="size-full object-cover" />
      </div>
      <Picture
        name="iphone-frame"
        alt=""
        sizes={sizes}
        className="pointer-events-none absolute inset-x-[0.67%] top-0 aspect-[0.491156] w-[98.67%]"
      />
    </figure>
  );
}
