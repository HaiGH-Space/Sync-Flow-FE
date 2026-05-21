"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type SettingsTab = {
  value: string;
  icon: ReactNode;
  label: string;
  description: string;
  /** Extra className for TabsTrigger (e.g. destructive active state) */
  triggerClassName?: string;
  /** Called when the tab trigger is clicked */
  onClick?: () => void;
  /** Tab content */
  content: ReactNode;
  /** Whether to render this tab (defaults to true) */
  visible?: boolean;
};

type SettingsDialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  defaultTab?: string;
  tabs: SettingsTab[];
};

const defaultTriggerClassName =
  "w-full justify-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/70 data-active:bg-primary/10 data-active:text-foreground data-active:shadow-sm";

export default function SettingsDialogShell({
  open,
  onOpenChange,
  title,
  description,
  defaultTab = "general",
  tabs,
}: SettingsDialogShellProps) {
  const tCommon = useTranslations("common");
  const visibleTabs = tabs.filter((tab) => tab.visible !== false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={defaultTab}
          orientation="vertical"
          className="flex h-[70vh] w-full gap-4"
        >
          <TabsList
            variant="line"
            className="h-full w-56 shrink-0 flex-col items-stretch justify-start gap-2 rounded-xl bg-transparent p-0 pr-2"
          >
            {visibleTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(defaultTriggerClassName, tab.triggerClassName)}
                onClick={tab.onClick}
              >
                {tab.icon}
                <span className="flex min-w-0 flex-col items-start text-left leading-tight w-full">
                  <span className="truncate w-full">{tab.label}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {tab.description}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0 flex-1 overflow-hidden">
            {visibleTabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 h-full space-y-4 overflow-y-auto pr-1"
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("actions.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
