import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-terracotta bg-terracotta text-white hover:border-terracotta-dark hover:bg-terracotta-dark",
  secondary:
    "border-line bg-paper text-ink hover:border-line-strong hover:bg-cream",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-cream hover:text-ink",
  danger:
    "border-red bg-red text-white hover:border-[#a34e3e] hover:bg-[#a34e3e]",
  success:
    "border-green bg-green text-white hover:border-[#4d7657] hover:bg-[#4d7657]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-[52px] px-5 py-3 text-base",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
