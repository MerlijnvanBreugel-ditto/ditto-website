import { Star } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/** Five stars, the app store score and the user count. */
export function RatingBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 md:items-end", className)}>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 text-ditto-night/80" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={13} weight="fill" />
          ))}
        </div>
        <p className="text-body-14-medium text-ditto-night md:text-deep-current">4.7/5</p>
      </div>
      <p className="text-body-14-medium text-deep-current md:text-atlantic-blue">100.000+ users</p>
    </div>
  );
}
