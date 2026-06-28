"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type NavigationSidebarItemProps = {
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  ariaPressed?: boolean;
};

export function NavigationSidebarItem({
  isSelected,
  onClick,
  icon,
  actions,
  children,
  className,
  ariaPressed,
}: NavigationSidebarItemProps) {
  return (
    <div
      className={cn(
        "group flex h-9 items-center gap-2 border-l-2 transition-all px-2 py-0",
        isSelected
          ? "bg-primary/10 text-foreground font-medium border-primary rounded-r-md"
          : "border-transparent hover:bg-sidebar-accent/50 text-sidebar-foreground/75 progress-left-pad",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "min-w-0 flex h-full flex-1 items-center gap-2 truncate text-left text-sm transition-colors outline-none",
          isSelected
            ? "font-medium text-foreground"
            : "text-muted-foreground group-hover:text-foreground"
        )}
        onClick={onClick}
        aria-pressed={ariaPressed ?? isSelected}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{children}</span>
      </button>
      {actions && <div className="shrink-0 flex items-center">{actions}</div>}
    </div>
  );
}
