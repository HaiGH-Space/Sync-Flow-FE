"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Priority as PriorityType } from "@/lib/api/issue";

type IssueSidebarSectionProps = {
  statusName: string;
  assigneeOptions: Array<{ value: string; label: string }>;
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  priority: PriorityType;
  priorityOptions: ReadonlyArray<{ value: PriorityType; label: string }>;
  priorityLabel: string;
  onPriorityChange: (value: PriorityType) => void;
  isDirty: boolean;
  isUpdating: boolean;
  isDeletingIssue: boolean;
  onSave: () => void;
  onDeleteClick: () => void;
  deleteModal: React.ReactNode;
  reporterName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  formatDate: (value: string | number | Date) => string;
};

export function IssueSidebarSection({
  statusName,
  assigneeOptions,
  assigneeId,
  onAssigneeChange,
  priority,
  priorityOptions,
  priorityLabel,
  onPriorityChange,
  isDirty,
  isUpdating,
  isDeletingIssue,
  onSave,
  onDeleteClick,
  deleteModal,
  reporterName,
  createdAt,
  updatedAt,
  formatDate,
}: IssueSidebarSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.detail.statusLabel")}
          </span>
          <div>
            <Badge variant="secondary">{statusName}</Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.form.assigneeLabel")}
          </span>
          <div className="space-y-2">
            <Select value={assigneeId} onValueChange={onAssigneeChange}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={tDashboard("issue.form.assigneePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="size-6">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User2 className="size-3" />
                </AvatarFallback>
              </Avatar>
              <span>
                {assigneeOptions.find((option) => option.value === assigneeId)
                  ?.label || tDashboard("issue.assignee.unassigned")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {tDashboard("issue.form.priorityLabel")}
          </span>
          <div className="space-y-2">
            <Select
              value={priority}
              onValueChange={(value) => onPriorityChange(value as PriorityType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={tDashboard("issue.form.priorityPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Flag
                className={cn(
                  "size-4",
                  priority === "HIGH"
                    ? "text-red-500"
                    : priority === "MEDIUM"
                      ? "text-yellow-500"
                      : "text-green-500",
                )}
              />
              <span className="text-sm">{priorityLabel}</span>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          className="w-full"
          onClick={onSave}
          disabled={!isDirty || isUpdating}
        >
          {isUpdating
            ? tDashboard("issue.update.submitting")
            : tDashboard("issue.detail.saveChanges")}
        </Button>

        <Button
          className="w-full"
          variant="destructive"
          onClick={onDeleteClick}
          disabled={isDeletingIssue}
        >
          {isDeletingIssue
            ? tDashboard("issue.detail.deletingIssue")
            : tDashboard("issue.detail.deleteIssue")}
        </Button>

        {deleteModal}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.reporterLabel")}
            </span>
            <span className="font-medium text-xs truncate max-w-30">
              {reporterName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.createdAtLabel")}
            </span>
            <span className="text-xs">{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {tDashboard("issue.detail.updatedAtLabel")}
            </span>
            <span className="text-xs">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
