import { TEAM_DEFINITIONS } from "@/data/teams";
import { cn } from "@/lib/cn";

interface TeamBadgeProps {
  slot: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClass = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[11px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-16 text-xl",
};

export function TeamBadge({ slot, size = "md", className }: TeamBadgeProps) {
  const definition = TEAM_DEFINITIONS[slot - 1];
  if (!definition) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-extrabold leading-none ring-2 ring-white/80",
        sizeClass[size],
        className,
      )}
      style={{
        backgroundColor: definition.color,
        color: definition.onColor,
      }}
      aria-hidden="true"
    >
      {slot}
    </span>
  );
}
