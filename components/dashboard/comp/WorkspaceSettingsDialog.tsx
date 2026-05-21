"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { RoleMember } from "@/lib/api/member-workspace";
import type { Workspace } from "@/lib/api/workspace";
import { useInviteWorkspaceMember } from "@/hooks/mutations/workspace-member";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Loader2,
  Settings2,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import SettingsDialogShell, { type SettingsTab } from "./SettingsDialogShell";

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

const inviteRoles = ["ADMIN", "MEMBER"] as const;

const createInviteMemberSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    email: z
      .string()
      .min(1, tValidation("workspace.invite.email_required"))
      .email(tValidation("auth.email_invalid")),
    role: z.enum(inviteRoles),
  });

type InviteMemberFormValues = z.infer<
  ReturnType<typeof createInviteMemberSchema>
>;

const inviteDefaultValues: InviteMemberFormValues = {
  email: "",
  role: "MEMBER",
};

type WorkspaceSettingsDialogProps = {
  workspace: Workspace;
  role: WorkspaceRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export default function WorkspaceSettingsDialog({
  workspace,
  role,
  open,
  onOpenChange,
  onDelete,
  isDeleting,
}: WorkspaceSettingsDialogProps) {
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate: inviteMember, isPending: isInviting } =
    useInviteWorkspaceMember();

  const inviteSchema = createInviteMemberSchema(tValidation);
  const canInviteMember = role === "OWNER" || role === "ADMIN";

  const inviteForm = useForm({
    defaultValues: inviteDefaultValues,
    validators: {
      onSubmit: inviteSchema,
      onChange: inviteSchema,
    },
    onSubmit: async ({ value }) => {
      inviteMember(
        {
          workspaceId: workspace.id,
          email: value.email.trim(),
          role: value.role,
        },
        {
          onSuccess: () => {
            toast.success(tDashboard("workspace.invite.toast.sent"));
            inviteForm.reset();
          },
          onError: () => {
            toast.error(tDashboard("workspace.invite.toast.failed"));
          },
        },
      );
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmDelete(false);
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        inviteForm.reset();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [inviteForm, open]);

  const { data: memberProfilesResponse } = useQuery(
    createWorkspaceMemberProfilesQueryOptions(
      { workspaceId: workspace.id },
      {
        enabled: open,
      },
    ),
  );

  const memberProfiles = useMemo(
    () => memberProfilesResponse?.data ?? [],
    [memberProfilesResponse?.data],
  );
  const workspaceMembers = useMemo(
    () => workspace.members ?? [],
    [workspace.members],
  );

  const roleLabel = useMemo(() => {
    if (role === "OWNER") {
      return tDashboard("sidebar.role.owner");
    }

    if (role === "ADMIN") {
      return tDashboard("sidebar.role.admin");
    }

    return tDashboard("sidebar.role.member");
  }, [role, tDashboard]);

  const tabs: SettingsTab[] = useMemo(
    () => [
      {
        value: "general",
        icon: <Settings2 className="size-4 shrink-0 text-muted-foreground" />,
        label: tDashboard("workspace.tabs.general"),
        description: tDashboard("workspace.tabs.generalDescription"),
        content: (
          <>
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {tDashboard("workspace.settings.name")}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {workspace.name}
                </p>
              </div>
              <Badge variant="secondary">{roleLabel}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {tDashboard("workspace.settings.id")}
                </p>
                <p className="mt-1 break-all text-sm">{workspace.id}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {tDashboard("workspace.settings.slug")}
                </p>
                <p className="mt-1 break-all text-sm">{workspace.urlSlug}</p>
              </div>
            </div>

            <Separator />

            <p className="text-sm text-muted-foreground">
              {role === "OWNER" || role === "ADMIN"
                ? tDashboard("workspace.settings.manageHint")
                : tDashboard("workspace.settings.memberHint")}
            </p>
          </>
        ),
      },
      {
        value: "members",
        icon: <Users className="size-4 shrink-0 text-muted-foreground" />,
        label: tDashboard("workspace.tabs.members.title"),
        description: tDashboard("workspace.tabs.members.description"),
        content: (
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {tDashboard("workspace.tabs.members.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tDashboard("workspace.settings.membersDescription")}
                </p>
              </div>
              <Badge variant="secondary">{workspaceMembers.length}</Badge>
            </div>

            {canInviteMember && (
              <div className="border-b p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {tDashboard("workspace.invite.title")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tDashboard("workspace.invite.description")}
                  </p>
                </div>

                <form
                  className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end"
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    inviteForm.handleSubmit();
                  }}
                >
                  <inviteForm.Field name="email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel>
                            {tDashboard("workspace.invite.emailLabel")}
                          </FieldLabel>
                          <Input
                            type="email"
                            value={field.state.value}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            placeholder={tDashboard(
                              "workspace.invite.emailPlaceholder",
                            )}
                            autoComplete="email"
                          />
                          <div className="min-h-5">
                            <FieldError errors={field.state.meta.errors} />
                          </div>
                        </Field>
                      );
                    }}
                  </inviteForm.Field>

                  <inviteForm.Field name="role">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel>
                            {tDashboard("workspace.invite.roleLabel")}
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value as RoleMember)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={tDashboard(
                                  "workspace.invite.rolePlaceholder",
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MEMBER">
                                {tDashboard("sidebar.role.member")}
                              </SelectItem>
                              <SelectItem value="ADMIN">
                                {tDashboard("sidebar.role.admin")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="min-h-5">
                            <FieldError errors={field.state.meta.errors} />
                          </div>
                        </Field>
                      );
                    }}
                  </inviteForm.Field>

                  <Button
                    type="submit"
                    size="sm"
                    className="sm:mb-0.5"
                    disabled={isInviting}
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {tDashboard("workspace.invite.submitting")}
                      </>
                    ) : (
                      tDashboard("workspace.invite.submit")
                    )}
                  </Button>
                </form>
              </div>
            )}

            <div className="divide-y">
              {memberProfiles.length > 0 ? (
                memberProfiles.map((member) => {
                  const memberRecord = workspaceMembers.find(
                    (item) => item.userId === member.id,
                  );
                  const memberRoleLabel =
                    member.id === workspace.ownerId
                      ? tDashboard("sidebar.role.owner")
                      : memberRecord?.role === "ADMIN"
                        ? tDashboard("sidebar.role.admin")
                        : tDashboard("sidebar.role.member");

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={member.image} />
                          <AvatarFallback>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {member.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{memberRoleLabel}</Badge>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  {tDashboard("workspace.settings.noMembers")}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        value: "permissions",
        icon: <Shield className="size-4 shrink-0 text-muted-foreground" />,
        label: tDashboard("workspace.tabs.permissions.title"),
        description: tDashboard("workspace.tabs.permissions.description"),
        content: (
          <>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">
                {tDashboard("workspace.tabs.permissions.title")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {role === "OWNER" || role === "ADMIN"
                  ? tDashboard("workspace.settings.permissionsAdminHint")
                  : tDashboard("workspace.settings.permissionsMemberHint")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">
                  {tDashboard(
                    "workspace.settings.permissionItem.manageProjects",
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role === "OWNER" || role === "ADMIN"
                    ? tDashboard("workspace.settings.permissionAllowed.label")
                    : tDashboard(
                        "workspace.settings.permissionRestricted.label",
                      )}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">
                  {tDashboard(
                    "workspace.settings.permissionItem.manageMembers",
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role === "OWNER"
                    ? tDashboard("workspace.settings.permissionAllowed.label")
                    : tDashboard(
                        "workspace.settings.permissionRestricted.label",
                      )}
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        value: "danger",
        icon: (
          <AlertTriangle className="size-4 shrink-0 text-muted-foreground" />
        ),
        label: tDashboard("workspace.settings.tabs.dangerZone"),
        description: tDashboard(
          "workspace.settings.tabs.dangerZoneDescription",
        ),
        triggerClassName:
          "data-active:bg-destructive/10 data-active:text-destructive",
        onClick: () => setConfirmDelete(false),
        visible: role === "OWNER",
        content: (
          <>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-destructive">
                    {tDashboard("workspace.settings.dangerTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tDashboard("workspace.settings.dangerDescription")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {tDashboard("workspace.delete.title", {
                      name: workspace.name,
                    })}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {tDashboard("workspace.settings.deleteWarning")}
                  </p>
                </div>

                {!confirmDelete ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {tCommon("actions.delete")}
                  </Button>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      {tCommon("actions.cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          {tCommon("status.deleting")}
                        </>
                      ) : (
                        tCommon("actions.confirm")
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        ),
      },
    ],
    [
      tDashboard,
      tCommon,
      workspace,
      role,
      roleLabel,
      memberProfiles,
      workspaceMembers,
      confirmDelete,
      isDeleting,
      onDelete,
      canInviteMember,
      inviteForm,
      isInviting,
    ],
  );

  return (
    <SettingsDialogShell
      open={open}
      onOpenChange={handleOpenChange}
      title={tDashboard("workspace.settings.title")}
      description={tDashboard("workspace.settings.description")}
      tabs={tabs}
    />
  );
}
