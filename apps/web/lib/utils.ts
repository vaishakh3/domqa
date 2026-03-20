import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...values: Array<string | undefined | false | null>) => twMerge(clsx(values));
export const formatDate = (value: string | Date) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
