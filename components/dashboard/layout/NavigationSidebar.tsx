"use client";

import { Workspace } from "@/lib/api/workspace";
import ProjectSettingsDialog from "../comp/ProjectSettingsDialog";
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
import { useNavigationSidebar } from "./navigation-sidebar/use-navigation-sidebar";

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

export function NavigationSidebar({
  workspaceDetail,
}: {
  workspaceDetail?: Workspace;
}) {
  const {
    isOpenSidebarLeft,
    selectedSprintIdByProject,
    selectedChannelIdByProject,
    t,
    expandedProjectId,
    setExpandedProjectId,
    settingsProject,
    setSettingsProject,
    editingSprint,
    setEditingSprint,
    canLoadProjects,
    currentWorkspaceRole,
    canManageProject,
    projectsResponse,
    error,
    isProjectsLoading,
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
    // Infinite paging
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // Sublist states
    showAllSprints,
    setShowAllSprints,
    showAllChannels,
    setShowAllChannels,
    activeTab,
    setActiveTab,
    searchQuery,
  } = useNavigationSidebar(workspaceDetail);

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
                      projects={projectsResponse?.data?.items ?? []}
                      filteredProjects={filteredProjects}
                      workspaceId={workspaceDetail?.id ?? ""}
                      expandedProjectId={expandedProjectId}
                      onExpandProjectAction={setExpandedProjectId}
                      onOpenProjectSettingsAction={setSettingsProject}
                      sprints={sprintsResponse?.data?.items}
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
                      activeTab={activeTab}
                      onActiveTabChange={setActiveTab}
                      showAllSprints={showAllSprints}
                      onToggleShowAllSprints={() => setShowAllSprints((prev) => !prev)}
                      showAllChannels={showAllChannels}
                      onToggleShowAllChannels={() => setShowAllChannels((prev) => !prev)}
                      hasNextPage={hasNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      onLoadMoreAction={fetchNextPage}
                      searchQuery={searchQuery}
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
            onOpenChange={handleSettingsOpenChange}
            onDelete={handleDeleteProject}
            isDeleting={isDeletingProject}
          />
        )}

        {editingSprint && workspaceDetail?.id && (
          <EditSprintModal
            key={editingSprint.id}
            projectId={editingSprint.projectId}
            sprint={editingSprint}
            open={!!editingSprint}
            onOpenChangeAction={handleEditSprintOpenChange}
          />
        )}
      </>
    </LazyMotion>
  );
}
