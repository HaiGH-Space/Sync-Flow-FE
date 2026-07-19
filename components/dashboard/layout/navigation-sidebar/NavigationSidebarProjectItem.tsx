"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/api/project";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationSidebarChannelList } from "./NavigationSidebarChannelList";
import { NavigationSidebarSprintList } from "./NavigationSidebarSprintList";

import type { SprintsState, ChannelsState } from "./NavigationSidebarProjectList";

type NavigationSidebarProjectItemProps = {
  project: Project;
  workspaceId: string;
  isExpanded: boolean;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
  sprintsState: SprintsState;
  channelsState: ChannelsState;

  // Lifted states
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
};

export function NavigationSidebarProjectItemHeader({
  project,
  workspaceId,
  isExpanded,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
}: {
  project: Project;
  workspaceId: string;
  isExpanded: boolean;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
}) {
  const t = useTranslations("dashboard");

  return (
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
  );
}

export function NavigationSidebarProjectItemContent({
  isExpanded,
  workspaceId,
  projectId,
  sprintsState,
  channelsState,
  activeTab,
  onActiveTabChange,
}: {
  isExpanded: boolean;
  workspaceId: string;
  projectId: string;
  sprintsState: SprintsState;
  channelsState: ChannelsState;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out overflow-hidden",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
              projectId={projectId}
              sprints={sprintsState.items}
              isFetching={sprintsState.isFetching}
              error={sprintsState.error}
              selectedSprintId={sprintsState.selectedId}
              onSelectSprintAction={sprintsState.onSelect}
              onEditSprintAction={sprintsState.onEdit}
              showAllSprints={sprintsState.showAll}
              onToggleShowAllSprints={sprintsState.onToggleShowAll}
            />
          </TabsContent>
          <TabsContent value="channels">
            <NavigationSidebarChannelList
              channels={channelsState.items}
              isFetching={channelsState.isFetching}
              error={channelsState.error}
              selectedChannelId={channelsState.selectedId}
              onSelectChannelAction={channelsState.onSelect}
              workspaceId={workspaceId}
              projectId={projectId}
              showAllChannels={channelsState.showAll}
              onToggleShowAllChannels={channelsState.onToggleShowAll}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function NavigationSidebarProjectItem({
  project,
  workspaceId,
  isExpanded,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
  sprintsState,
  channelsState,
  activeTab,
  onActiveTabChange,
}: NavigationSidebarProjectItemProps) {
  return (
    <div className="rounded-md my-2">
      <NavigationSidebarProjectItemHeader
        project={project}
        workspaceId={workspaceId}
        isExpanded={isExpanded}
        onExpandProjectAction={onExpandProjectAction}
        onOpenProjectSettingsAction={onOpenProjectSettingsAction}
      />
      <NavigationSidebarProjectItemContent
        isExpanded={isExpanded}
        workspaceId={workspaceId}
        projectId={project.id}
        sprintsState={sprintsState}
        channelsState={channelsState}
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
      />
    </div>
  );
}

