import { cn } from "@/lib/utils";

const VARIANT_CLASSES: Record<string, string> = {
  default: "bg-secondary text-secondary-foreground",
  score: "bg-primary text-primary-foreground",
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  success: "bg-emerald-100 text-emerald-800",
  error: "bg-red-100 text-red-800",
  running: "bg-blue-100 text-blue-800",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANT_CLASSES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default,
        className
      )}
    >
      {children}
    </span>
  );
}
