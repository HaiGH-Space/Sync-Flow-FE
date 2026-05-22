"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Workspace } from "@/lib/api/workspace";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import FieldAnimation from "@/components/auth/FieldAnimation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCreateProject } from "@/hooks/mutations/project";

type CreateProjectModalProps = {
  workspaceDetail: Workspace;
};

const createProjectSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    name: z.string().min(1, tValidation("project.name_required")),
    key: z.string().min(1, tValidation("project.key_required")),
    description: z.string().optional(),
  });

type FormSchema = z.infer<ReturnType<typeof createProjectSchema>>;

const defaultValues: FormSchema = {
  name: "",
  key: "",
  description: "",
};

export default function CreateProjectModal({
  workspaceDetail,
}: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const schema = createProjectSchema(tValidation);
  const { mutate: createProject, isPending } = useCreateProject(
    workspaceDetail.id,
  );

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      console.log("Creating project with values:", value);
      createProject(
        {
          workspaceId: workspaceDetail.id,
          project: value,
        },
        {
          onSuccess: () => {
            toast.success(tDashboard("project.toast.created"));
            handleOpenChange(false);
          },
          onError: () => {
            toast.error(tDashboard("project.toast.createFailed"));
          },
        },
      );
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
        <Button className="cursor-pointer" size="icon-lg">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tDashboard("project.create.title")}</DialogTitle>
          <DialogDescription>
            {tDashboard("project.create.description", {
              workspaceName: workspaceDetail.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-project-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldAnimation
            form={form}
            name="name"
            placeholder={tDashboard("project.create.namePlaceholder")}
          />
          <FieldAnimation
            form={form}
            name="key"
            placeholder={tDashboard("project.create.keyPlaceholder")}
          />
          <FieldAnimation
            form={form}
            name="description"
            placeholder={tDashboard("project.create.descriptionPlaceholder")}
          />
          <Button
            type="submit"
            className="mt-4 cursor-pointer w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {tCommon("status.creating")}
              </>
            ) : (
              tDashboard("project.create.submit")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
