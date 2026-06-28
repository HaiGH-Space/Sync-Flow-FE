"use client";

import { Workspace } from "@/lib/api/workspace";
import { useDashboard } from "@/lib/store/use-dashboard";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/use-profile";
import ProjectSettingsDialog from "../comp/ProjectSettingsDialog";
import { createWorkspaceDetailQueryOptions } from "@/queries/workspace";
import { createProjectsQueryOptions } from "@/queries/project";
import { createSprintsQueryOptions } from "@/queries/sprint";
import { createChannelsQueryOptions } from "@/queries/channel";
import { useDeleteProject } from "@/hooks/mutations/project";
import type { Project } from "@/lib/api/project";
import type { Sprint } from "@/lib/api/sprint";
import EditSprintModal from "@/components/dashboard/comp/EditSprintModal";
import { Search } from "@/components/shared/Search";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Variants,
} from "framer-motion";
import { NavigationSidebarFooter } from "./navigation-sidebar/NavigationSidebarFooter";
import { NavigationSidebarHeader } from "./navigation-sidebar/NavigationSidebarHeader";
import { NavigationSidebarProjectList } from "./navigation-sidebar/NavigationSidebarProjectList";
import type { WorkspaceRole } from "./navigation-sidebar/navigation-sidebar.types";

const sidebarContainerVariants: Variants = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  visible: {
    width: 250,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

export const NavigationSidebar = memo(function NavigationSidebar({
  workspaceDetail,
}: {
  workspaceDetail?: Workspace;
}) {
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

  const {
    data: projectsResponse,
    error,
    isFetching,
  } = useQuery(
    createProjectsQueryOptions(
      { workspaceId: workspaceDetail?.id ?? "" },
      {
        enabled: canLoadProjects,
      },
    ),
  );
  const isProjectsLoading =
    canLoadProjects && (isFetching || !projectsResponse);

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject(workspaceDetail?.id ?? "");

  const {
    data: sprintsResponse,
    error: sprintsError,
    isFetching: isSprintsFetching,
  } = useQuery(
    createSprintsQueryOptions(
      { projectId: expandedProjectId ?? "" },
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
    const projectList = projectsResponse?.data ?? [];
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return projectList;
    }

    return projectList.filter((project) =>
      project.name.toLowerCase().includes(normalizedQuery),
    );
  }, [projectsResponse?.data, searchQuery]);

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

  return (
    <LazyMotion features={domAnimation}>
      <>
        <AnimatePresence mode="wait">
          {isOpenSidebarLeft && (
            <m.aside
              className="border-r border-sidebar-border whitespace-nowrap bg-sidebar text-foreground h-full overflow-hidden"
              variants={sidebarContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="h-full flex flex-col w-62.5">
                <NavigationSidebarHeader
                  workspaceDetail={workspaceDetail}
                  role={currentWorkspaceRole}
                  canManageProject={canManageProject}
                />

                <div className="p-4 flex-1 flex flex-col mt-4 overflow-y-auto">
                  <div className="mb-4">
                    <Search
                      placeholder={t("sidebar.searchPlaceholder")}
                      onSearch={searchHandle}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <NavigationSidebarProjectList
                      status={{
                        canLoadProjects,
                        isProjectsLoading,
                        isSprintsFetching,
                        isChannelsFetching,
                      }}
                      projectsError={error}
                      projects={projectsResponse?.data ?? []}
                      filteredProjects={filteredProjects}
                      workspaceId={workspaceDetail?.id ?? ""}
                      expandedProjectId={expandedProjectId}
                      onExpandProjectAction={setExpandedProjectId}
                      onOpenProjectSettingsAction={setSettingsProject}
                      sprints={sprintsResponse?.data}
                      sprintsError={sprintsError}
                      selectedSprintId={
                        selectedSprintIdByProject[expandedProjectId ?? ""] ??
                        "all"
                      }
                      onSelectSprintAction={handleSprintSelect}
                      onEditSprintAction={setEditingSprint}
                      channels={channelsResponse?.data}
                      channelsError={channelsError}
                      selectedChannelId={
                        selectedChannelIdByProject[expandedProjectId ?? ""] ??
                        ""
                      }
                      onSelectChannelAction={handleChannelSelect}
                    />
                  </div>
                </div>

                <NavigationSidebarFooter />
              </div>
            </m.aside>
          )}
        </AnimatePresence>

        {settingsProject && workspaceDetail?.id && (
          <ProjectSettingsDialog
            project={settingsProject}
            canManage={canManageProject}
            open={!!settingsProject}
            onOpenChange={(open) => {
              if (!open && !isDeletingProject) {
                setSettingsProject(null);
              }
            }}
            onDelete={() => {
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
            }}
            isDeleting={isDeletingProject}
          />
        )}

        {editingSprint && workspaceDetail?.id && (
          <EditSprintModal
            key={editingSprint.id}
            projectId={editingSprint.projectId}
            sprint={editingSprint}
            open={!!editingSprint}
            onOpenChangeAction={(open) => {
              if (!open) {
                setEditingSprint(null);
              }
            }}
          />
        )}
      </>
    </LazyMotion>
  );
});
