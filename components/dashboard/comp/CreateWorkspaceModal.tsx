'use client'

import { useState, type BaseSyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useCreateWorkspace } from "@/hooks/mutations/workspace";

function toUrlSlug(value: string) {
    const normalized = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);

    return normalized || `workspace-${Date.now()}`;
}

export default function CreateWorkspaceModal() {
    const [isOpen, setIsOpen] = useState(false);

    const tDashboard = useTranslations("dashboard");

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-xl cursor-pointer"
                    aria-label={tDashboard("workspace.create.submit")}
                >
                    <PlusIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <CreateWorkspaceDialog onClose={setIsOpen} />
        </Dialog>
    );
}


function CreateWorkspaceDialog(props: {
    onClose(open: boolean): void,
}) {
    const { mutate: createWorkspace, isPending } = useCreateWorkspace();
    const [workspaceName, setWorkspaceName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const tDashboard = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const tValidation = useTranslations("validation");
    const { push } = useRouter();
    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const trimmedName = workspaceName.trim();

        if (!trimmedName) {
            setNameError(tValidation("workspace.name_required"));
            return;
        }

        setNameError(null);
        createWorkspace({
            name: trimmedName,
            urlSlug: toUrlSlug(trimmedName),
        }, {
            onSuccess: (response) => {
                toast.success(tDashboard("workspace.toast.created"));
                props.onClose(false);
                setWorkspaceName("");
                setNameError(null);
                push(`/dashboard/${response.data.id}`);
            },
            onError: () => {
                toast.error(tDashboard("workspace.toast.createFailed"));
            }
        }
        );
    };
    return <DialogContent>
        <DialogHeader>
            <DialogTitle>{tDashboard("workspace.create.title")}</DialogTitle>
            <DialogDescription>{tDashboard("workspace.create.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
                <Label htmlFor="workspace-name">{tDashboard("workspace.create.nameLabel")}</Label>
                <Input
                    id="workspace-name"
                    value={workspaceName}
                    onChange={(e) => {
                        setWorkspaceName(e.target.value);
                        if (nameError) {
                            setNameError(null);
                        }
                    }}
                    placeholder={tDashboard("workspace.create.namePlaceholder")}
                    disabled={isPending}
                    aria-invalid={Boolean(nameError)}
                />
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {tCommon("status.creating")}
                    </>
                ) : (
                    tDashboard("workspace.create.submit")
                )}
            </Button>
        </form>
    </DialogContent>
}