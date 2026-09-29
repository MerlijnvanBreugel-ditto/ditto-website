import { CaretDown, Globe } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const DUTCH_HOME = "https://www.dittocare.com/nl/";

/**
 * Framer's locale picker: a native <select> laid invisibly over its visual, so it stays
 * keyboard and screen-reader friendly. Choosing Nederlands opens the Dutch site.
 */
export function LanguageSelect({ variant }: { variant: "icon" | "pill" }) {
  return (
    <div className="relative inline-flex">
      <label htmlFor={`language-${variant}`} className="sr-only">
        Select Language
      </label>
      <select
        id={`language-${variant}`}
        defaultValue="en"
        onChange={(e) => {
          if (e.target.value === "nl") window.location.href = DUTCH_HOME;
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none flex items-center text-ditto-midnight",
          variant === "pill" &&
            "gap-[5px] rounded-[30px] bg-sky-tint px-5 py-1.5 font-inter text-sm leading-[1.5]",
        )}
      >
        <Globe size={18} />
        {variant === "pill" && (
          <>
            <span>English</span>
            <CaretDown size={12} weight="bold" />
          </>
        )}
      </div>
    </div>
  );
}
