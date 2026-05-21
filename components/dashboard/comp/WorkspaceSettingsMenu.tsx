'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Copy, Settings2 } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import WorkspaceSettingsDialog from "./WorkspaceSettingsDialog"
import { useDeleteWorkspace } from "@/hooks/mutations/workspace"
import { useRouter } from "@/i18n/navigation"
import { useCurrentWorkspace } from "@/hooks/use-current-workspace"

type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER'

type WorkspaceSettingsMenuProps = {
    role: WorkspaceRole
}

export default function WorkspaceSettingsMenu({ role }: WorkspaceSettingsMenuProps) {
    const { activeWorkspace: workspace } = useCurrentWorkspace()
    const tDashboard = useTranslations('dashboard')
    const { push } = useRouter()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace()

    const copyWorkspaceId = async () => {
        try {
            await navigator.clipboard.writeText(workspace!.id)
            toast.success(tDashboard('workspace.settings.copied'))
        } catch {
            toast.error(tDashboard('workspace.settings.copyFailed'))
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-auto w-full max-w-45 min-w-0 flex-1 justify-start gap-2 px-0 text-left hover:bg-transparent"
                    >
                        <span className="min-w-0 flex-1 text-left">
                            <span className="block truncate text-lg font-semibold">
                                {workspace!.name}
                            </span>
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                        <Settings2 className="size-4" />
                        {tDashboard('workspace.menu.openSettings')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyWorkspaceId}>
                        <Copy className="size-4" />
                        {tDashboard('workspace.menu.copyId')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <WorkspaceSettingsDialog
                workspace={workspace!}
                role={role}
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                isDeleting={isDeletingWorkspace}
                onDelete={() => {
                    deleteWorkspace({ workspaceId: workspace!.id }, {
                        onSuccess: () => {
                            toast.success(tDashboard('workspace.toast.deleted'))
                            setIsSettingsOpen(false)
                            push('/dashboard')
                        },
                        onError: () => {
                            toast.error(tDashboard('workspace.toast.deleteFailed'))
                        },
                    })
                }}
            />
        </>
    )
}