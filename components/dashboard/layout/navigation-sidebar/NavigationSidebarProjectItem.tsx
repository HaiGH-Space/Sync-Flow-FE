"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import type { Channel } from "@/lib/api/channel";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationSidebarChannelList } from "./NavigationSidebarChannelList";
import { NavigationSidebarSprintList } from "./NavigationSidebarSprintList";

type NavigationSidebarProjectItemProps = {
  project: Project;
  workspaceId: string;
  isExpanded: boolean;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
  sprints?: Sprint[];
  isSprintsFetching: boolean;
  sprintsError?: Error | null;
  selectedSprintId: string;
  onSelectSprintAction: (projectId: string, sprintId: string) => void;
  onEditSprintAction: (sprint: Sprint) => void;
  channels?: Channel[];
  isChannelsFetching: boolean;
  channelsError?: Error | null;
  selectedChannelId: string;
  onSelectChannelAction: (projectId: string, channelId: string) => void;

  // Lifted states
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  showAllSprints: boolean;
  onToggleShowAllSprints: () => void;
  showAllChannels: boolean;
  onToggleShowAllChannels: () => void;
};

export function NavigationSidebarProjectItem({
  project,
  workspaceId,
  isExpanded,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
  sprints,
  isSprintsFetching,
  sprintsError,
  selectedSprintId,
  onSelectSprintAction,
  onEditSprintAction,
  channels,
  isChannelsFetching,
  channelsError,
  selectedChannelId,
  onSelectChannelAction,
  activeTab,
  onActiveTabChange,
  showAllSprints,
  onToggleShowAllSprints,
  showAllChannels,
  onToggleShowAllChannels,
}: NavigationSidebarProjectItemProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="rounded-md my-2">
      <div className="flex items-center gap-1">
        <Link
          href={`/dashboard/${workspaceId}/${project.id}`}
          aria-label={`Switch to ${project.name}`}
          aria-current={isExpanded ? "page" : undefined}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            if (isExpanded) {
              event.preventDefault();
            }
            onExpandProjectAction(project.id);
          }}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium overflow-hidden",
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="truncate text-left">{project.name}</span>
          <ChevronRight
            className={cn(
              "size-4 shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-90" : "rotate-0",
            )}
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label={t("project.settings.action", { name: project.name })}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOpenProjectSettingsAction(project);
          }}
        >
          <Settings2 className="size-4" />
        </Button>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <Tabs value={activeTab} onValueChange={onActiveTabChange}>
            <TabsList variant="line" className="mx-3 mt-2">
              <TabsTrigger value="sprints">
                {t("sidebar.sprintsTab")}
              </TabsTrigger>
              <TabsTrigger value="channels">
                {t("sidebar.channelsTab")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sprints">
              <NavigationSidebarSprintList
                workspaceId={workspaceId}
                projectId={project.id}
                sprints={sprints}
                isFetching={isSprintsFetching}
                error={sprintsError}
                selectedSprintId={selectedSprintId}
                onSelectSprintAction={onSelectSprintAction}
                onEditSprintAction={onEditSprintAction}
                showAllSprints={showAllSprints}
                onToggleShowAllSprints={onToggleShowAllSprints}
              />
            </TabsContent>
            <TabsContent value="channels">
              <NavigationSidebarChannelList
                channels={channels}
                isFetching={isChannelsFetching}
                error={channelsError}
                selectedChannelId={selectedChannelId}
                onSelectChannelAction={onSelectChannelAction}
                workspaceId={workspaceId}
                projectId={project.id}
                showAllChannels={showAllChannels}
                onToggleShowAllChannels={onToggleShowAllChannels}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

