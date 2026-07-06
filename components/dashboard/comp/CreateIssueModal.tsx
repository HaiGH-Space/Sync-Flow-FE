"use client";
import { useState } from "react";
import { CreateIssue, Issue } from "@/lib/api/issue";
import { DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateIssue } from "@/hooks/mutations/issue";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginatedData } from "@/lib/api/api";
import { issueKeys } from "@/queries/issue";
import { toast } from "sonner";
import IssueFormDialog, { IssueFormValues } from "./IssueFormDialog";
import { useProfile } from "@/hooks/use-profile";
import { useParams } from "next/navigation";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import { useTranslations } from "next-intl";
import { getTailOrder } from "@/lib/ordering";
import { createSprintsQueryOptions } from "@/queries/sprint";
import { useDashboard } from "@/lib/store/use-dashboard";

interface CreateIssueModalProps {
  columnId: string;
  projectId: string;
}

export default function CreateIssueModal({
  columnId,
  projectId,
}: CreateIssueModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createIssue, isPending } = useCreateIssue(projectId);
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const tDashboard = useTranslations("dashboard");
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[projectId] ?? "all",
  );
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;

  const { data: memberProfilesResponse } = useQuery(
    createWorkspaceMemberProfilesQueryOptions(
      { workspaceId },
      {
        enabled: !!workspaceId,
      },
    ),
  );

  const { data: sprintsResponse } = useQuery(
    createSprintsQueryOptions({ projectId, limit: 100 }, { enabled: !!projectId }),
  );

  const assigneeOptions = memberProfilesResponse?.data
    ? memberProfilesResponse.data.map((u) => ({
        value: u.id,
        label:
          profile?.id === u.id
            ? tDashboard("issue.assignee.me", { name: u.name })
            : u.name,
      }))
    : undefined;

  const sprintOptions = sprintsResponse?.data?.items
    ? sprintsResponse.data.items.map((sprint) => ({
        value: sprint.id,
        label: sprint.name,
      }))
    : undefined;

  const sprintDefaultValue =
    selectedSprintId !== "all" ? selectedSprintId : "NO_SPRINT";

  const handleSubmit = async (value: IssueFormValues) => {
    const cachedIssues = queryClient.getQueryData<ApiResponse<PaginatedData<Issue>>>(
      issueKeys.list(projectId, { limit: 100 }),
    );
    let newOrder = getTailOrder();
    if (cachedIssues?.data?.items) {
      const columnIssues = cachedIssues.data.items
        .filter((issue) => issue.columnId === columnId)
        .sort((a, b) => a.order - b.order);

      if (columnIssues.length > 0) {
        const lastIssue = columnIssues[columnIssues.length - 1];
        newOrder = getTailOrder(lastIssue.order);
      }
    }
    const issueData: CreateIssue = {
      order: newOrder,
      columnId,
      title: value.title,
      priority: value.priority,
      description: value.description,
      assigneeId: value.assigneeId,
      sprintId: value.sprintId,
    };
    createIssue(
      { projectId, issueData },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.created"));
          setIsOpen(false);
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.createFailed"));
        },
      },
    );
  };

  return (
    <IssueFormDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      dialogTitle={tDashboard("issue.create.title")}
      dialogDescription={tDashboard("issue.create.description")}
      submitLabel={tDashboard("issue.create.submit")}
      submittingLabel={tDashboard("issue.create.submitting")}
      isSubmitting={isPending}
      assigneeOptions={assigneeOptions}
      sprintOptions={sprintOptions}
      defaultValues={{ sprintId: sprintDefaultValue }}
      onSubmit={handleSubmit}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="ghost" size="icon">
          <PlusIcon className="size-4" />
        </Button>
      </DialogTrigger>
    </IssueFormDialog>
  );
}
