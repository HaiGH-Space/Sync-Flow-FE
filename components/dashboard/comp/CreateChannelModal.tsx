"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import FieldAnimation from "@/components/auth/FieldAnimation";
import { useCreateChannel } from "@/hooks/mutations/channel";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import { ChannelType, ChannelVisibility } from "@/lib/api/channel";
import { useProfile } from "@/hooks/use-profile";

const createChannelSchema = () =>
  z.object({
    name: z.string().optional(),
    memberIds: z.array(z.string()),
  });

type FormSchema = z.infer<ReturnType<typeof createChannelSchema>>;

type CreateChannelModalProps = {
  workspaceId: string;
  projectId: string;
  onCreatedAction?: (channelId: string) => void;
  trigger?: ReactNode;
};

const defaultValues: FormSchema = {
  name: "",
  memberIds: [],
};

export default function CreateChannelModal({
  workspaceId,
  projectId,
  onCreatedAction,
  trigger,
}: CreateChannelModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const { data: profile } = useProfile();
  const schema = createChannelSchema();
  const { mutate: createChannel, isPending } = useCreateChannel(projectId);

  const { data: memberProfilesResponse, isLoading: isMembersLoading } =
    useQuery(
      createWorkspaceMemberProfilesQueryOptions(
        { workspaceId },
        { enabled: !!workspaceId },
      ),
    );

  const memberProfiles = memberProfilesResponse?.data ?? [];
  const allMemberIds = memberProfiles.map((m) => m.id);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const selectedMembers =
        value.memberIds && value.memberIds.length > 0
          ? value.memberIds
          : undefined;

      const payload = {
        name: value.name?.trim() ? value.name.trim() : undefined,
        type: ChannelType.GROUP,
        visibility: ChannelVisibility.PUBLIC,
        memberIds: selectedMembers,
      };

      createChannel(payload, {
        onSuccess: (response) => {
          toast.success(tDashboard("channel.toast.created"));
          onCreatedAction?.(response.data.id);
          handleOpenChange(false);
        },
        onError: () => {
          toast.error(tDashboard("channel.toast.createFailed"));
        },
      });
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        form.reset();
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon className="size-4" />
            {tDashboard("channel.create.action")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tDashboard("channel.create.title")}</DialogTitle>
          <DialogDescription>
            {tDashboard("channel.create.description")}
          </DialogDescription>
        </DialogHeader>
        <form
          action={form.handleSubmit}
        >
          <FieldAnimation
            form={form}
            name="name"
            placeholder={tDashboard("channel.create.namePlaceholder")}
          />

          <form.Field name="memberIds">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const currentSelected =
                field.state.value && field.state.value.length > 0
                  ? field.state.value
                  : allMemberIds;
              const selectedIds = new Set(currentSelected);

              const handleToggleMember = (
                memberId: string,
                checked: boolean,
              ) => {
                const baseList =
                  field.state.value && field.state.value.length > 0
                    ? field.state.value
                    : allMemberIds;

                if (!checked) {
                  field.handleChange(
                    baseList.filter((id: string) => id !== memberId),
                  );
                  return;
                }

                field.handleChange([...baseList, memberId]);
              };

              return (
                <Field className="mt-4" data-invalid={isInvalid}>
                  <FieldLabel>
                    {tDashboard("channel.create.membersLabel")}
                  </FieldLabel>
                  <ScrollArea className="h-40 rounded-md border border-border/70">
                    <div className="space-y-1 p-2">
                      {isMembersLoading && (
                        <div className="text-sm text-muted-foreground">
                          {tDashboard("channel.create.membersLoading")}
                        </div>
                      )}
                      {!isMembersLoading && memberProfiles.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          {tDashboard("channel.create.noMembers")}
                        </div>
                      )}
                      {!isMembersLoading &&
                        memberProfiles.map((member) => {
                          const label =
                            profile?.id === member.id
                              ? tDashboard("issue.assignee.me", {
                                  name: member.name,
                                })
                              : member.name;

                          const checkboxId = `channel-member-${member.id}`;

                          return (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
                            >
                              <Checkbox
                                id={checkboxId}
                                checked={selectedIds.has(member.id)}
                                onCheckedChange={(checked) =>
                                  handleToggleMember(
                                    member.id,
                                    checked === true,
                                  )
                                }
                              />
                              <Label htmlFor={checkboxId} className="truncate">
                                {label}
                              </Label>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {tCommon("status.creating")}
              </>
            ) : (
              tDashboard("channel.create.submit")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
