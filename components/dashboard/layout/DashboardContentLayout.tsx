"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  navigateItems,
  NavigateType,
  useDashboard,
} from "@/lib/store/use-dashboard";
import { MessageCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { createSprintsQueryOptions } from "@/queries/sprint";
import type { Sprint } from "@/lib/api/sprint";
import CreateSprintModal from "@/components/dashboard/comp/CreateSprintModal";
import { ChatRightPanel } from "@/components/dashboard/layout/ChatRightPanel";
import NotificationsMenu from "@/components/dashboard/notifications/NotificationsMenu";

export default function DashboardContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft);
  const toggleSidebarLeft = useDashboard((state) => state.toggleSidebarLeft);
  const isOpenSidebarRight = useDashboard((state) => state.isOpenSidebarRight);
  const toggleSidebarRight = useDashboard((state) => state.toggleSidebarRight);

  useEffect(() => {
    const result = useDashboard.persist.rehydrate();
    if (result instanceof Promise) {
      void result.then(() => {
        setHasHydrated(true);
      });
    } else {
      void Promise.resolve().then(() => {
        setHasHydrated(true);
      });
    }
  }, []);

  const activeSidebarLeft = hasHydrated ? isOpenSidebarLeft : true;
  const activeSidebarRight = hasHydrated ? isOpenSidebarRight : false;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-white dark:bg-background">
      <header className="text-lg flex items-center h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-background/90 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebarLeft}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle navigation sidebar"
        >
          {activeSidebarLeft ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <div>
          <HeaderTabList />
        </div>
        <div className="ml-auto flex items-center gap-2 px-2">
          <HeaderSprintSelect />
          <NotificationsMenu />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarRight}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle chat panel"
            aria-pressed={activeSidebarRight}
          >
            <MessageCircle />
          </Button>
        </div>
      </header>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-background">
          {children}
        </main>
        <ChatRightPanel />
      </div>
    </div>
  );
}

function HeaderTabList() {
  const t = useTranslations("dashboard");
  const activeNavigate = useDashboard((s) => s.activeNavigate);
  const setActiveNavigate = useDashboard((s) => s.setActiveNavigate);
  return (
    <Tabs
      value={activeNavigate.value}
      onValueChange={(v) => setActiveNavigate(v as NavigateType)}
    >
      <TabsList className="py-5">
        {Object.values(navigateItems).map((navigate) => (
          <TabsTrigger
            className="capitalize gap-x-2 py-4"
            key={navigate.value}
            value={navigate.value}
          >
            <navigate.icon className="size-4" />
            {navigate.value === NavigateType.BOARD
              ? t("navigation.board")
              : navigate.value === NavigateType.BACKLOG
                ? t("navigation.backlog")
                : navigate.value === NavigateType.PLANNING
                  ? t("navigation.planning")
                  : t("navigation.timeline")}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

const EMPTY_SPRINTS: Sprint[] = [];

function HeaderSprintSelect() {
  const t = useTranslations("dashboard");
  const { projectId } = useParams<{ projectId?: string }>();
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[projectId ?? ""] ?? "all",
  );
  const setSelectedSprintId = useDashboard(
    (state) => state.setSelectedSprintId,
  );

  const { data: sprintsResponse, isLoading, isSuccess } = useQuery(
    createSprintsQueryOptions(
      { projectId: projectId ?? "", limit: 100 },
      {
        enabled: !!projectId,
      },
    ),
  );

  const sprintOptions = sprintsResponse?.data?.items ?? EMPTY_SPRINTS;
  const isDisabled = !projectId;

  useEffect(() => {
    if (!isSuccess || selectedSprintId === "all") {
      return;
    }

    const exists = sprintOptions.some(
      (sprint) => sprint.id === selectedSprintId,
    );
    if (!exists) {
      setSelectedSprintId(projectId ?? "", "all");
    }
  }, [projectId, selectedSprintId, setSelectedSprintId, sprintOptions, isSuccess]);

  return (
    <div className="flex items-center gap-2">
      {projectId ? (
        <CreateSprintModal
          projectId={projectId}
          onCreated={(sprintId) => setSelectedSprintId(projectId, sprintId)}
        />
      ) : null}
      <Select
        value={selectedSprintId}
        onValueChange={(value) => setSelectedSprintId(projectId ?? "", value)}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-44" disabled={isDisabled}>
          <SelectValue
            placeholder={
              !projectId
                ? t("header.sprintNoProject")
                : isLoading && sprintOptions.length === 0
                  ? t("header.sprintLoading")
                  : t("header.sprintEmpty")
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("header.sprintAll")}</SelectItem>
          {sprintOptions.map((sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
