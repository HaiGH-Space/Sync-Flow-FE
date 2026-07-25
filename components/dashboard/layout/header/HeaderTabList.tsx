"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  navigateItems,
  NavigateType,
  useDashboard,
} from "@/lib/store/use-dashboard";
import { useTranslations } from "next-intl";

export function HeaderTabList() {
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
