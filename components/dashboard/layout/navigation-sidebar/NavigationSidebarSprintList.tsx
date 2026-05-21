"use client";

import { Button } from "@/components/ui/button";
import CreateSprintModal from "@/components/dashboard/comp/CreateSprintModal";
import { useRouter } from "@/i18n/navigation";
import type { Sprint } from "@/lib/api/sprint";
import { cn } from "@/lib/utils";
import { Loader2, PlusIcon, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

type NavigationSidebarSprintListProps = {
  workspaceId: string;
  projectId: string;
  sprints?: Sprint[];
  isFetching: boolean;
  error?: Error | null;
  selectedSprintId: string;
  onSelectSprintAction: (sprintId: string) => void;
  onEditSprintAction: (sprint: Sprint) => void;
};

export function NavigationSidebarSprintList({
  workspaceId,
  projectId,
  sprints,
  isFetching,
  error,
  selectedSprintId,
  onSelectSprintAction,
  onEditSprintAction,
}: NavigationSidebarSprintListProps) {
  const t = useTranslations("dashboard");
  const { push } = useRouter();

  return (
    <div className="mt-2 pl-3">
      <div className="border-l border-border pl-3 space-y-1">
        <div className="sticky top-0 z-10 -ml-3 border-b border-border/60 bg-background/95 px-3 pb-2 pt-2 backdrop-blur">
          <CreateSprintModal
            projectId={projectId}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-start gap-2 px-2 py-1.5 text-muted-foreground hover:text-foreground"
              >
                <PlusIcon className="size-3.5" />
                {t("sprint.create.action")}
              </Button>
            }
          />
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>{t("sidebar.loadingSprints")}</span>
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive">
            {t("sidebar.errorLoadingSprints")}
          </div>
        )}
        {!isFetching && !error && (sprints?.length ?? 0) === 0 && (
          <div className="cursor-default text-sm text-muted-foreground">
            {t("sidebar.noSprints")}
          </div>
        )}
        {sprints?.map((sprint) => {
          const isSprintSelected = selectedSprintId === sprint.id;

          return (
            <div
              key={sprint.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                isSprintSelected ? "bg-primary/10" : "hover:bg-accent/50",
              )}
            >
              <button
                type="button"
                className={cn(
                  "min-w-0 flex flex-1 items-center gap-2 truncate rounded-md px-2 py-1 text-left text-sm transition-colors",
                  isSprintSelected
                    ? "font-medium text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                onClick={() => {
                  onSelectSprintAction(sprint.id);
                  push(`/dashboard/${workspaceId}/${projectId}`);
                }}
                aria-pressed={isSprintSelected}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full transition-colors",
                    isSprintSelected
                      ? "bg-primary"
                      : "bg-muted-foreground/35 group-hover:bg-foreground/60",
                  )}
                />
                {sprint.name}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "shrink-0 text-muted-foreground transition-colors hover:text-foreground",
                  isSprintSelected && "text-foreground",
                )}
                aria-label={t("sprint.edit.action")}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onEditSprintAction(sprint);
                }}
              >
                <Settings2 className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
