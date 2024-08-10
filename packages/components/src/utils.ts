import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      "font-weight": [
        "font-normal",
        "font-medium",
        "font-semibold",
        "font-bold",

        "font-template-light",
        "font-template-normal",
        "font-template-semibold",
        "font-template-bold",
      ],
      "font-size": [
        "text-jumbo",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-lead",
        "text-large",
        "text-p",
        "text-p-ui",
        "text-form",
        "text-form-small",
        "text-list",
        "text-body",
        "text-subtle",
        "text-small",
        "text-detail",
        "text-blockquote",
        "text-inline-code",
        "text-table-head",
        "text-table-item",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
