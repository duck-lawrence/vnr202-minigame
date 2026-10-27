"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface TimerProps {
  duration: number;
  label: string;
  onStart?: () => void;
}

export function Timer({ duration, label, onStart }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [deadline, setDeadline] = useState<number | null>(null);
  const running = deadline !== null;

  useEffect(() => {
    if (deadline === null) {
      return;
    }
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setDeadline(null);
      }
    };
    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const start = () => {
    setRemaining(duration);
    setDeadline(Date.now() + duration * 1000);
    onStart?.();
  };

  const progress = duration > 0 ? (remaining / duration) * 100 : 0;
  const urgent = remaining <= 5;

  return (
    <div className="card-soft flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            urgent
              ? "bg-red-soft text-red"
              : "bg-terracotta-soft text-terracotta-dark",
          )}
        >
          <ClockIcon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p
            className={cn(
              "timer-digits display text-2xl leading-none",
              urgent ? "text-red" : "text-ink",
            )}
          >
            {remaining}
            <span className="ml-1 font-sans text-sm font-medium text-muted">
              giây
            </span>
          </p>
        </div>
      </div>

      <div className="flex min-w-36 flex-1 items-center gap-3 sm:justify-end">
        <div className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-cream-deep">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-200",
              urgent ? "bg-red" : "bg-terracotta",
            )}
            style={{ width: `${Math.max(0, progress)}%` }}
          />
        </div>
        <Button
          size="sm"
          variant={running ? "ghost" : "secondary"}
          onClick={start}
          className="shrink-0"
        >
          {running ? "Chạy lại" : remaining === duration ? "Bắt đầu" : "Chạy lại"}
        </Button>
      </div>
    </div>
  );
}
