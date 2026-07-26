"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/store/use-dashboard";
import { MessageCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { HeaderTabList } from "@/components/dashboard/layout/header/HeaderTabList";
import { HeaderSprintSelect } from "@/components/dashboard/layout/header/HeaderSprintSelect";
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
