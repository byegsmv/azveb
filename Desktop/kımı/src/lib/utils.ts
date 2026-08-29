import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "tr-TR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function generateMetadata(title: string, description: string) {
  return {
    title: `${title} | Azveb Media`,
    description,
    openGraph: {
      title: `${title} | Azveb Media`,
      description,
      type: "website",
    },
  };
}
