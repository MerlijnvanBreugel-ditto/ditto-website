import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The Ditto text styles in styles.css (text-heading-1-s, text-body-16-medium, …) set the font
// size, so tailwind-merge must not mistake them for text colours and drop one of the two.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(v: string) => /^(heading|body|label|footer|faq|display)-/.test(v)] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
