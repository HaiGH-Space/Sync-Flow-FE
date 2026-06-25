"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { Workspace } from "@/lib/api/workspace";
import { cn, getFirstLetters } from "@/lib/utils";
import CreateWorkspaceModal from "../comp/CreateWorkspaceModal";

type WorkspaceRailProps = {
  workspaceList: Workspace[] | undefined;
  isPending: boolean;
  workspaceActiveId?: string;
};

export function WorkspaceRail({
  workspaceList,
  isPending,
  workspaceActiveId,
}: WorkspaceRailProps) {
  return (
    <div className="border-r border-sidebar-border w-20 h-full bg-sidebar flex flex-col items-center gap-4 p-4">
      {isPending ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="size-10rounded-xl " />
          ))}
        </>
      ) : (
        workspaceList?.map((ws) => (
          <WorkspaceItem
            key={ws.id}
            name={ws.name}
            isActive={workspaceActiveId === ws.id}
            id={ws.id}
          />
        ))
      )}
      <div className="mt-auto pt-2">
        <CreateWorkspaceModal />
      </div>
    </div>
  );
}
type WorkspaceItemProps = {
  name: string;
  isActive: boolean;
  id: string;
};
function WorkspaceItem({ name, isActive, id }: WorkspaceItemProps) {
  return (
    <div className="relative group flex items-center justify-center">
      <div
        className={cn(
          "absolute -left-3 w-1 h-8 bg-primary rounded-r-full transition-all duration-300",
          isActive ? "opacity-100 h-8" : "opacity-0 h-4 group-hover:opacity-50",
        )}
      />
      <Link
        href={`/dashboard/${id}`}
        aria-label={`Switch to ${name}`}
        className={cn(
          "relative size-10 flex items-center justify-center rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden",
          isActive
            ? "bg-primary text-primary-foreground shadow-md scale-100"
            : "bg-sidebar-accent/50 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-105",
        )}
      >
        {getFirstLetters(name)}
      </Link>

      <div className="absolute left-14 z-50 hidden px-2 py-1 text-xs font-medium text-popover-foreground bg-popover border border-border rounded opacity-0 group-hover:opacity-100 group-hover:block whitespace-nowrap transition-opacity animate-in fade-in slide-in-from-left-2 shadow-md">
        {name}
        <div className="absolute top-1/2 -left-1.5 -mt-1 border-4 border-transparent border-r-border" />
      </div>
    </div>
  );
}
