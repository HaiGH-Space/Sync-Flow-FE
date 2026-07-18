'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Project } from "@/lib/api/project"
import { useTranslations } from "next-intl"
import { AlertTriangle, Loader2, Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import SettingsDialogShell, { type SettingsTab } from "./SettingsDialogShell"

type ProjectSettingsDialogProps = {
    project: Project
    canManage: boolean
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    isDeleting: boolean
}

export default function ProjectSettingsDialog({
    project,
    canManage,
    open,
    onOpenChange,
    onDelete,
    isDeleting,
}: ProjectSettingsDialogProps) {
    const tDashboard = useTranslations('dashboard')
    const tCommon = useTranslations('common')
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setConfirmDelete(false)
        }
        onOpenChange(nextOpen)
    }

    const tabs: SettingsTab[] = [
        {
            value: 'general',
            icon: <Settings2 className="size-4 shrink-0 text-muted-foreground" />,
            label: tDashboard('project.settings.tabs.general'),
            description: tDashboard('project.settings.tabs.generalDescription'),
            content: (
                <>
                    {/* Project Name */}
                    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium">{tDashboard('project.settings.nameLabel')}</p>
                            <p className="truncate text-sm text-muted-foreground">{project.name}</p>
                        </div>
                        <Badge variant="secondary">{project.key}</Badge>
                    </div>

                    {/* Project Key & ID */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {tDashboard('project.settings.keyLabel')}
                            </p>
                            <p className="mt-1 break-all text-sm font-mono">{project.key}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {tDashboard('project.settings.idLabel')}
                            </p>
                            <p className="mt-1 break-all text-sm font-mono">{project.id}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <>
                            <Separator />
                            <div className="rounded-lg border p-3">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {tDashboard('project.settings.descriptionLabel')}
                                </p>
                                <p className="mt-1 text-sm text-foreground">{project.description}</p>
                            </div>
                        </>
                    )}

                    <Separator />

                    <p className="text-sm text-muted-foreground">
                        {tDashboard('project.settings.manageHint')}
                    </p>
                </>
            ),
        },
        {
            value: 'danger',
            icon: <AlertTriangle className="size-4 shrink-0 text-muted-foreground" />,
            label: tDashboard('project.settings.tabs.dangerZone'),
            description: tDashboard('project.settings.tabs.dangerZoneDescription'),
            triggerClassName: "data-active:bg-destructive/10 data-active:text-destructive",
            onClick: () => setConfirmDelete(false),
            visible: canManage,
            content: (
                <>
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-destructive">
                                    {tDashboard('project.settings.dangerTitle')}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {tDashboard('project.settings.dangerDescription')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-medium">
                                    {tDashboard('project.delete.title', { name: project.name })}
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {tDashboard('project.settings.deleteWarning')}
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
                                    {tCommon('actions.delete')}
                                </Button>
                            ) : (
                                <div className="flex shrink-0 items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConfirmDelete(false)}
                                        disabled={isDeleting}
                                    >
                                        {tCommon('actions.cancel')}
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
                                                {tCommon('status.deleting')}
                                            </>
                                        ) : (
                                            tCommon('actions.confirm')
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ),
        },
    ]

    return (
        <SettingsDialogShell
            open={open}
            onOpenChange={handleOpenChange}
            title={tDashboard('project.settings.title')}
            description={tDashboard('project.settings.description')}
            tabs={tabs}
        />
    )
}
