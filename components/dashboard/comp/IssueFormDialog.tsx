"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { z } from "zod";
import { Priority } from "@/lib/api/issue";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import FieldAnimation, {
  SelectAnimation,
} from "@/components/auth/FieldAnimation";
import { useTranslations } from "next-intl";

const createIssueFormSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    title: z.string().min(1, tValidation("issue.title_required")),
    priority: z.enum(Priority),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    sprintId: z.string().optional(),
  });

export type IssueFormValues = z.infer<ReturnType<typeof createIssueFormSchema>>;

const baseDefaultValues: IssueFormValues = {
  title: "",
  priority: "MEDIUM",
  description: "",
  assigneeId: "UNASSIGNED",
  sprintId: "NO_SPRINT",
};

export type AssigneeOption = { value: string; label: string };
export type SprintOption = { value: string; label: string };

type IssueFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dialogDescription?: string;
  children?: ReactNode;
  assigneeOptions?: AssigneeOption[];
  sprintOptions?: SprintOption[];
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: Partial<IssueFormValues>;
  onSubmit: (values: IssueFormValues) => void | Promise<void>;
};

export default function IssueFormDialog({
  open,
  onOpenChange,
  dialogTitle,
  dialogDescription,
  children,
  assigneeOptions,
  sprintOptions,
  submitLabel,
  submittingLabel = "Saving...",
  isSubmitting = false,
  defaultValues,
  onSubmit,
}: IssueFormDialogProps) {
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const issueFormSchema = createIssueFormSchema(tValidation);

  const mergedDefaultValues = useMemo<IssueFormValues>(
    () => ({ ...baseDefaultValues, ...defaultValues }),
    [defaultValues],
  );

  const form = useForm({
    defaultValues: mergedDefaultValues,
    validators: {
      onSubmit: issueFormSchema,
      onChange: issueFormSchema,
    },
    onSubmit: async ({ value }) => {
      const normalized: IssueFormValues = {
        ...value,
        assigneeId:
          value.assigneeId === "UNASSIGNED" ? undefined : value.assigneeId,
        sprintId: value.sprintId === "NO_SPRINT" ? undefined : value.sprintId,
      };
      await onSubmit(normalized);
    },
  });

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        form.reset();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open, form]);

  const priorityOptions = Object.values(Priority).map((val) => ({
    value: val,
    label: tDashboard(
      `issue.priority.${val.toLowerCase() as "low" | "medium" | "high"}`,
    ),
  }));

  const normalizedAssigneeOptions = assigneeOptions
    ? [
        { value: "UNASSIGNED", label: tDashboard("issue.assignee.unassigned") },
        ...assigneeOptions,
      ]
    : undefined;

  const normalizedSprintOptions = sprintOptions
    ? [
        { value: "NO_SPRINT", label: tDashboard("issue.form.sprintNone") },
        ...sprintOptions,
      ]
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription ? (
            <DialogDescription>{dialogDescription}</DialogDescription>
          ) : null}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldAnimation
            form={form}
            name="title"
            placeholder={tDashboard("issue.form.titlePlaceholder")}
          />
          <FieldAnimation
            form={form}
            name="description"
            placeholder={tDashboard("issue.form.descriptionPlaceholder")}
          />
          {normalizedAssigneeOptions ? (
            <SelectAnimation
              form={form}
              name="assigneeId"
              placeholder={tDashboard("issue.form.assigneePlaceholder")}
              fieldLabel={tDashboard("issue.form.assigneeLabel")}
              data={normalizedAssigneeOptions}
            />
          ) : null}
          {normalizedSprintOptions ? (
            <SelectAnimation
              form={form}
              name="sprintId"
              placeholder={tDashboard("issue.form.sprintPlaceholder")}
              fieldLabel={tDashboard("issue.form.sprintLabel")}
              data={normalizedSprintOptions}
            />
          ) : null}
          <SelectAnimation
            form={form}
            name="priority"
            placeholder={tDashboard("issue.form.priorityPlaceholder")}
            fieldLabel={tDashboard("issue.form.priorityLabel")}
            data={priorityOptions}
          />
          <Button
            type="submit"
            className="mt-4 cursor-pointer w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {submittingLabel || tCommon("status.saving")}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
