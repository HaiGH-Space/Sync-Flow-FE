'use client'
import { useCallback, useMemo, useState } from 'react'
import type { SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

type BacklogTableProps = {
  rows: IssueRow[]
  onIssueSelect: (issueId: string) => void
}

export default function BacklogTable({ rows, onIssueSelect }: BacklogTableProps) {
  const tDashboard = useTranslations('dashboard')
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const dateFormatter = useMemo(() => createDateFormatter(locale), [locale])

  const tableColumns = useMemo(
    () => createBacklogTableColumns({ tDashboard, dateFormatter }),
    [dateFormatter, tDashboard]
  )

  const statusOptions = useMemo(
    () => Array.from(new Set(rows.map((issue) => issue.statusName))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [rows]
  )

  const rowsByDropdownFilters = useMemo(() => {
    return rows.filter((issue) => {
      const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter
      const matchStatus = statusFilter === 'all' || issue.statusName === statusFilter
      return matchPriority && matchStatus
    })
  }, [priorityFilter, rows, statusFilter])

  const globalFilterFn = useCallback((row: { original: IssueRow }, _columnId: string, filterValue: unknown) => {
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
  }, [])

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
    getPaginationRowModel: getPaginationRowModel(),
  })

  const hasActiveFilters = priorityFilter !== 'all' || statusFilter !== 'all'

  const handlePriorityFilterChange = useCallback((value: string) => {
    setPriorityFilter(value as 'all' | Priority)
  }, [])

  const handleResetFilters = useCallback(() => {
    setPriorityFilter('all')
    setStatusFilter('all')
  }, [])

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
    </div>
  )
}
