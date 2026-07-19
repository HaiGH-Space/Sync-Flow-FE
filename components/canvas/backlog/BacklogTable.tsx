'use client'
import { useState } from 'react'
import type { SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useLocale, useTranslations } from 'next-intl'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createDateFormatter } from '@/lib/format-date'
import { Priority } from '@/lib/api/issue'
import type { IssueRow } from './types'
import BacklogTableToolbar from './BacklogTableToolbar'
import { createBacklogTableColumns } from './BacklogTableColumns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type BacklogTableProps = {
  rows: IssueRow[]
  onIssueSelect: (issueId: string) => void
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export default function BacklogTable({
  rows,
  onIssueSelect,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: BacklogTableProps) {
  const tDashboard = useTranslations('dashboard')
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const dateFormatter = createDateFormatter(locale)

  const tableColumns = createBacklogTableColumns({ tDashboard, dateFormatter })

  const statusOptions = Array.from(new Set(rows.map((issue) => issue.statusName)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  const rowsByDropdownFilters = rows.filter((issue) => {
    const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter
    const matchStatus = statusFilter === 'all' || issue.statusName === statusFilter
    return matchPriority && matchStatus
  })

  const globalFilterFn = (row: { original: IssueRow }, _columnId: string, filterValue: unknown) => {
    const search = String(filterValue ?? '').trim().toLowerCase()
    if (!search) return true

    const issue = row.original
    const tokens = [
      issue.title,
      String(issue.number),
      issue.assigneeName,
      issue.statusName,
    ]

    return tokens.some((token) => token.toLowerCase().includes(search))
  }

  // TanStack Table returns non-memoizable functions; keep this hook outside React Compiler memoization.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rowsByDropdownFilters,
    columns: tableColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const hasActiveFilters = priorityFilter !== 'all' || statusFilter !== 'all'

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value as 'all' | Priority)
  }

  const handleResetFilters = () => {
    setPriorityFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="space-y-4">
      <BacklogTableToolbar
        filteredCount={table.getFilteredRowModel().rows.length}
        totalCount={rows.length}
        countLabel={tDashboard('backlog.countLabel')}
        searchPlaceholder={tDashboard('backlog.searchPlaceholder')}
        statusFilterLabel={tDashboard('backlog.filters.status')}
        statusFilterPlaceholder={tDashboard('backlog.filters.status')}
        priorityFilterLabel={tDashboard('backlog.filters.priority')}
        priorityFilterPlaceholder={tDashboard('backlog.filters.priority')}
        allFilterLabel={tDashboard('backlog.filters.all')}
        statusOptions={statusOptions}
        selectedStatus={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedPriority={priorityFilter}
        onPriorityFilterChange={handlePriorityFilterChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        resetFiltersLabel={tDashboard('backlog.filters.reset')}
        onSearch={setGlobalFilter}
      />

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => onIssueSelect(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1 py-1 mt-4">
        <div className="text-sm text-muted-foreground">
          {tDashboard('backlog.pagination.showing', {
            start: String(total === 0 ? 0 : (page - 1) * limit + 1),
            end: String(Math.min(page * limit, total)),
            total: String(total),
            countLabel: tDashboard('backlog.countLabel'),
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {tDashboard('backlog.pagination.rowsPerPage')}
            </span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue placeholder={String(limit)} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label={tDashboard('backlog.pagination.previous')}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-8 text-center">
              {page}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => onPageChange(page + 1)}
              disabled={page * limit >= total}
              aria-label={tDashboard('backlog.pagination.next')}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
