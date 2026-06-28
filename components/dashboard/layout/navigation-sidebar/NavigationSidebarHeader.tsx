"use client";

import CreateProjectModal from "../../comp/CreateProjectModal";
import WorkspaceSettingsMenu from "../../comp/WorkspaceSettingsMenu";
import type { Workspace } from "@/lib/api/workspace";
import { useTranslations } from "next-intl";
import type { WorkspaceRole } from "./navigation-sidebar.types";

type NavigationSidebarHeaderProps = {
  workspaceDetail?: Workspace;
  role: WorkspaceRole;
  canManageProject: boolean;
};

export function NavigationSidebarHeader({
  workspaceDetail,
  role,
  canManageProject,
}: NavigationSidebarHeaderProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="h-14 px-4 flex flex-row justify-between items-center gap-2 border-b border-sidebar-border bg-sidebar/90 backdrop-blur overflow-hidden min-w-0">
      {workspaceDetail ? (
        <>
          <WorkspaceSettingsMenu role={role} />
          {canManageProject && (
            <CreateProjectModal workspaceDetail={workspaceDetail} />
          )}
        </>
      ) : (
        <h2 className="text-lg font-semibold truncate">
          {t("sidebar.noWorkspaceSelected")}
        </h2>
      )}
    </div>
  );
}
