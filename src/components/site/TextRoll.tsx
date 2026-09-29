import { cn } from "@/lib/utils";

/**
 * Framer's hover "text roll": the label is duplicated and both copies slide up one line
 * while the parent (which needs the `group` class) is hovered.
 */
export function TextRoll({
  children,
  className,
  hoverClassName,
}: {
  children: string;
  className?: string;
  /** Extra classes for the copy that rolls in (e.g. a different colour). */
  hoverClassName?: string;
}) {
  const roll =
    "block transition-transform duration-300 ease-framer group-hover:-translate-y-full motion-reduce:transition-none";
  return (
    <span className={cn("relative block overflow-hidden whitespace-nowrap", className)}>
      <span className={roll}>{children}</span>
      <span aria-hidden className={cn(roll, "absolute inset-x-0 top-full", hoverClassName)}>
        {children}
      </span>
    </span>
  );
}
