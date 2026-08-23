'use client'
import DashboardContentLayout from "@/components/dashboard/layout/DashboardContentLayout";
import { NavigationSidebar } from "@/components/dashboard/layout/NavigationSidebar";
import { WorkspaceRail } from "@/components/dashboard/layout/WorkspaceRail";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
    const {
        workspaceList,
        isPending,
        error,
        workspaceId,
        activeWorkspace,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useCurrentWorkspace()
    const t = useTranslations('dashboard');

    useEffect(() => {
        if (error) {
            toast.error(t('toast.loadWorkspaceFailed'))
        }
    }, [error, t])

    return <div className="flex flex-row w-full h-screen">
        <WorkspaceRail
            workspaceList={workspaceList}
            isPending={isPending}
            workspaceActiveId={workspaceId}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
        />
        <NavigationSidebar workspaceDetail={activeWorkspace} />
        <DashboardContentLayout>
            {children}
        </DashboardContentLayout>
    </div>
}