"use client";

import type { Channel } from "@/lib/api/channel";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationSidebarProjectItem } from "./NavigationSidebarProjectItem";
import { InfiniteScrollSentinel } from "./InfiniteScrollSentinel";

export type SprintsState = {
  items?: Sprint[];
  isFetching: boolean;
  error?: Error | null;
  selectedId: string;
  showAll: boolean;
  onSelect: (projectId: string, sprintId: string) => void;
  onEdit: (sprint: Sprint) => void;
  onToggleShowAll: () => void;
};

export type ChannelsState = {
  items?: Channel[];
  isFetching: boolean;
  error?: Error | null;
  selectedId: string;
  showAll: boolean;
  onSelect: (projectId: string, channelId: string) => void;
  onToggleShowAll: () => void;
};

export type ProjectListStatus = {
  canLoadProjects: boolean;
  isProjectsLoading: boolean;
  projectsError?: Error | null;
  projectsCount: number;
  filteredProjectsCount: number;
};

type NavigationSidebarProjectListProps = {
  status: {
    canLoadProjects: boolean;
    isProjectsLoading: boolean;
  };
  projectsError?: Error | null;
  projects: Project[];
  filteredProjects: Project[];
  workspaceId: string;
  expandedProjectId: string | null;
  onExpandProjectAction: (projectId: string) => void;
  onOpenProjectSettingsAction: (project: Project) => void;
  sprintsState: SprintsState;
  channelsState: ChannelsState;

  // Lifted states
  activeTab: string;
  onActiveTabChange: (tab: string) => void;

  // Infinite scroll
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMoreAction: () => void;
  searchQuery: string;
};

type NavigationSidebarProjectListStatusProps = {
  status: ProjectListStatus;
};

export function NavigationSidebarProjectListStatus({
  status,
}: NavigationSidebarProjectListStatusProps) {
  const t = useTranslations("dashboard");
  const {
    projectsError,
    isProjectsLoading,
    canLoadProjects,
    projectsCount,
    filteredProjectsCount,
  } = status;

  if (projectsError) {
    return (
      <div className="px-3 py-2 text-sm text-destructive">
        {projectsError.message}
      </div>
    );
  }

  if (isProjectsLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>{t("sidebar.loadingProjects")}</span>
      </div>
    );
  }

  if (canLoadProjects && projectsCount === 0) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        {t("sidebar.noProjects")}
      </div>
    );
  }

  if (canLoadProjects && projectsCount > 0 && filteredProjectsCount === 0) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        {t("sidebar.noSearchResults")}
      </div>
    );
  }

  return null;
}

export function NavigationSidebarProjectList({
  status,
  projectsError,
  projects,
  filteredProjects,
  workspaceId,
  expandedProjectId,
  onExpandProjectAction,
  onOpenProjectSettingsAction,
  sprintsState,
  channelsState,
  activeTab,
  onActiveTabChange,
  hasNextPage,
  isFetchingNextPage,
  onLoadMoreAction,
  searchQuery,
}: NavigationSidebarProjectListProps) {
  const t = useTranslations("dashboard");
  const {
    canLoadProjects,
    isProjectsLoading,
  } = status;

  return (
    <nav className="space-y-1">
      {searchQuery && hasNextPage && (
        <div className="px-3 py-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded mb-2 whitespace-normal wrap-break-word">
          {t("sidebar.searchMoreHint")}
        </div>
      )}

      <NavigationSidebarProjectListStatus
        status={{
          projectsError,
          isProjectsLoading,
          canLoadProjects,
          projectsCount: projects.length,
          filteredProjectsCount: filteredProjects.length,
        }}
      />

      {filteredProjects.map((project) => (
        <NavigationSidebarProjectItem
          key={project.id}
          project={project}
          workspaceId={workspaceId}
          isExpanded={expandedProjectId === project.id}
          onExpandProjectAction={onExpandProjectAction}
          onOpenProjectSettingsAction={onOpenProjectSettingsAction}
          sprintsState={sprintsState}
          channelsState={channelsState}
          activeTab={activeTab}
          onActiveTabChange={onActiveTabChange}
        />
      ))}

      {hasNextPage && (
        <InfiniteScrollSentinel
          onIntersect={onLoadMoreAction}
          isLoading={isFetchingNextPage}
          enabled={hasNextPage}
        />
      )}
    </nav>
  );
}

