import { Picture } from "@/components/site/Picture";
import type { ImageName } from "@/lib/images.gen";
import { cn } from "@/lib/utils";

/**
 * An app screenshot inside the iPhone frame (Framer's phone component). Give it a width;
 * the frame image sets the height. The screen is 90% wide and sits 9px from the top.
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
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "absolute top-[9px] left-1/2 aspect-[0.461774] w-[90%] -translate-x-1/2 overflow-hidden",
          screenClassName,
        )}
      >
        <Picture name={screen} alt={alt} sizes={sizes} className="size-full object-cover" />
      </div>
      <Picture
        name="iphone-frame"
        alt=""
        sizes={sizes}
        className="pointer-events-none relative mx-[2px] block h-auto w-[calc(100%-4px)]"
      />
    </figure>
  );
}
