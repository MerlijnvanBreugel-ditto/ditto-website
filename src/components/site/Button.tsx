import type { Icon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { TextRoll } from "./TextRoll";

/** The primary pill button ("Black" variant in Framer), optionally with a Sky Tint icon chip. */
export function Button({
  href,
  children,
  icon: IconComponent,
  className,
}: {
  href: string;
  children: string;
  icon?: Icon;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "group inline-flex items-center justify-center gap-1.5 rounded-[30px] bg-ditto-midnight px-5 py-2 text-label-14 text-soft-sand transition-colors duration-300 ease-framer hover:bg-soft-sand",
        className,
      )}
    >
      <TextRoll hoverClassName="text-ditto-midnight">{children}</TextRoll>
      {IconComponent && (
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-2xl bg-sky-tint">
          <IconComponent size={14} className="text-ditto-midnight" />
        </span>
      )}
    </a>
  );
}
