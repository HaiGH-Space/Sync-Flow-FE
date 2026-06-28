'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import type { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Priority } from '@/lib/api/issue'
import type { IssueRow } from './types'

type BacklogTableColumnsParams = {
  tDashboard: ReturnType<typeof useTranslations<'dashboard'>>
  dateFormatter: (value: string | number | Date) => string
}

function getPriorityBadgeClass(priority: Priority) {
  if (priority === Priority.HIGH) return 'bg-destructive/15 text-destructive border-destructive/20 dark:bg-destructive/20'
  if (priority === Priority.MEDIUM) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
  return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
}

export function createBacklogTableColumns({
  tDashboard,
  dateFormatter,
}: BacklogTableColumnsParams): ColumnDef<IssueRow>[] {
  return [
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {tDashboard('backlog.columns.id')}
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => `ISSUE-${row.original.number}`,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {tDashboard('backlog.columns.title')}
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-90 truncate font-medium">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: tDashboard('backlog.columns.priority'),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`${getPriorityBadgeClass(row.original.priority)} hover:bg-transparent shadow-none border font-normal py-0.5 px-1.5`}
        >
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: 'assigneeName',
      header: tDashboard('backlog.columns.assignee'),
    },
    {
      accessorKey: 'statusName',
      header: tDashboard('backlog.columns.status'),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {tDashboard('backlog.columns.updatedAt')}
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => dateFormatter(row.original.updatedAt),
    },
  ]
}
