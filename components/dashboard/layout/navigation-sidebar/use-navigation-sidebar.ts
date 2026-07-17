import { useDashboard } from "@/lib/store/use-dashboard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/use-profile";
import { createWorkspaceDetailQueryOptions } from "@/queries/workspace";
import { createProjectsInfiniteQueryOptions } from "@/queries/project";
import { createSprintsQueryOptions } from "@/queries/sprint";
import { createChannelsQueryOptions } from "@/queries/channel";
import { useDeleteProject } from "@/hooks/mutations/project";
import { toast } from "sonner";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import type { Workspace } from "@/lib/api/workspace";
import type { WorkspaceRole } from "./navigation-sidebar.types";

export function useNavigationSidebar(workspaceDetail?: Workspace) {
  const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft);
  const selectedSprintIdByProject = useDashboard(
    (state) => state.selectedSprintIdByProject,
  );
  const setSelectedSprintId = useDashboard(
    (state) => state.setSelectedSprintId,
  );
  const selectedChannelIdByProject = useDashboard(
    (state) => state.selectedChannelIdByProject,
  );
  const setSelectedChannelId = useDashboard(
    (state) => state.setSelectedChannelId,
  );
  const setLastActiveChannel = useDashboard(
    (state) => state.setLastActiveChannel,
  );
  const setOpenSidebarRight = useDashboard(
    (state) => state.setOpenSidebarRight,
  );
  const { projectId }: { projectId: string | undefined } = useParams();
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { data: profile } = useProfile();
  const profileId = profile?.id;
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    () => projectId ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  // Centralized tab & sublist expanded states
  const [showAllSprints, setShowAllSprints] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);
  const [activeTab, setActiveTab] = useState("sprints");

  const canLoadProjects = !!workspaceDetail?.id && isOpenSidebarLeft;

  const { data: workspaceDetailResponse } = useQuery(
    createWorkspaceDetailQueryOptions(
      { workspaceId: workspaceDetail?.id ?? "" },
      {
        enabled: !!workspaceDetail?.id && isOpenSidebarLeft,
      },
    ),
  );

  const activeWorkspace = workspaceDetailResponse?.data ?? workspaceDetail;

  const currentWorkspaceRole = useMemo<WorkspaceRole>(() => {
    if (!activeWorkspace || !profileId) {
      return "MEMBER";
    }

    if (activeWorkspace.ownerId === profileId) {
      return "OWNER";
    }

    const currentMembership = activeWorkspace.members?.find(
      (member) => member.userId === profileId,
    );
    return currentMembership?.role ?? "MEMBER";
  }, [activeWorkspace, profileId]);

  const canManageProject =
    currentWorkspaceRole === "OWNER" || currentWorkspaceRole === "ADMIN";

  // Set up Project Infinite Query
  const {
    data: projectsInfiniteData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    createProjectsInfiniteQueryOptions(
      { workspaceId: workspaceDetail?.id ?? "", limit: 20 },
      {
        enabled: canLoadProjects,
      },
    ),
  );

  const projects = useMemo(() => {
    return projectsInfiniteData?.pages.flatMap((page) => page.data.items) ?? [];
  }, [projectsInfiniteData]);

  const isProjectsLoading =
    canLoadProjects && (isFetching && projects.length === 0);

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject(workspaceDetail?.id ?? "");

  const {
    data: sprintsResponse,
    error: sprintsError,
    isFetching: isSprintsFetching,
  } = useQuery(
    createSprintsQueryOptions(
      { projectId: expandedProjectId ?? "", limit: 100 },
      {
        enabled: !!expandedProjectId && isOpenSidebarLeft,
      },
    ),
  );

  const {
    data: channelsResponse,
    error: channelsError,
    isFetching: isChannelsFetching,
  } = useQuery(
    createChannelsQueryOptions(
      { projectId: expandedProjectId ?? "" },
      {
        enabled: !!expandedProjectId && isOpenSidebarLeft,
      },
    ),
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project) =>
      project.name.toLowerCase().includes(normalizedQuery),
    );
  }, [projects, searchQuery]);

  const searchHandle = useCallback(async (query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSprintSelect = useCallback(
    (projectId: string, sprintId: string) => {
      setSelectedSprintId(projectId, sprintId);
    },
    [setSelectedSprintId],
  );

  const handleChannelSelect = useCallback(
    (projectId: string, channelId: string) => {
      setSelectedChannelId(projectId, channelId);
      setLastActiveChannel(projectId, channelId);
      setOpenSidebarRight(true);
    },
    [setLastActiveChannel, setOpenSidebarRight, setSelectedChannelId],
  );

  const handleDeleteProject = () => {
    if (!settingsProject || !workspaceDetail?.id) {
      return;
    }

    deleteProject(
      {
        workspaceId: workspaceDetail.id,
        projectId: settingsProject.id,
      },
      {
        onSuccess: (_response, variables) => {
          toast.success(t("project.toast.deleted"));

          if (projectId === variables.projectId) {
            setExpandedProjectId(null);
            router.push(`/dashboard/${workspaceDetail.id}`);
          }

          setSettingsProject(null);
        },
        onError: () => {
          toast.error(t("project.toast.deleteFailed"));
        },
      },
    );
  };

  const handleSettingsOpenChange = (open: boolean) => {
    if (!open && !isDeletingProject) {
      setSettingsProject(null);
    }
  };

  const handleEditSprintOpenChange = (open: boolean) => {
    if (!open) {
      setEditingSprint(null);
    }
  };

  const handleExpandProjectAction = useCallback((id: string) => {
    setExpandedProjectId((prev) => {
      if (prev === id) {
        return null;
      }
      // Reset sublist states when expanding a different project
      setActiveTab("sprints");
      setShowAllSprints(false);
      setShowAllChannels(false);
      return id;
    });
  }, []);

  return {
    isOpenSidebarLeft,
    selectedSprintIdByProject,
    selectedChannelIdByProject,
    projectId,
    t,
    router,
    expandedProjectId,
    setExpandedProjectId: handleExpandProjectAction,
    searchQuery,
    settingsProject,
    setSettingsProject,
    editingSprint,
    setEditingSprint,
    canLoadProjects,
    currentWorkspaceRole,
    canManageProject,
    projectsResponse: { data: { items: projects } }, // Maintain backwards compatibility shape
    error,
    isProjectsLoading,
    deleteProject,
    isDeletingProject,
    sprintsResponse,
    sprintsError,
    isSprintsFetching,
    channelsResponse,
    channelsError,
    isChannelsFetching,
    filteredProjects,
    searchHandle,
    handleSprintSelect,
    handleChannelSelect,
    handleDeleteProject,
    handleSettingsOpenChange,
    handleEditSprintOpenChange,
    
    // Infinite paging props
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,

    // Centralized states
    showAllSprints,
    setShowAllSprints,
    showAllChannels,
    setShowAllChannels,
    activeTab,
    setActiveTab,
  };
}

