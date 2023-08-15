"use client"

import { formatTime } from "@/utils/time"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DiskDetailView from "@/app/client/components/disk-detail"
import NetworkInfo from "@/app/client/components/network-info"
import { SoTooltip } from "@/app/client/components/so-tooltip"

import { labels, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

// @ts-ignore
export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clientId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <SoTooltip content={row.getValue("clientId")}>
        <div className="max-w-[100px] truncate">{row.getValue("clientId")}</div>
      </SoTooltip>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <SoTooltip content={row.getValue("name")}>
            <span className="max-w-[150px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </SoTooltip>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 ${status.color}`} />
          )}
          <span className={status.color}>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )
  //
  //     if (!priority) {
  //       return null
  //     }
  //
  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "network",
    accessorKey: "clientId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Network" />
    ),
    cell: (row) => {
      return (
        <NetworkInfo
          trigger={<Button variant="ghost">View</Button>}
          // @ts-ignore
          clientId={row.getValue("clientId") as string}
        />
      )
    },
  },
  {
    id: "disk",
    accessorKey: "clientId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disk" />
    ),
    cell: (row) => (
      <DiskDetailView
        trigger={<Button variant="ghost">View</Button>}
        // @ts-ignore
        clientId={row.getValue("clientId") as string}
      />
    ),
  },
  {
    accessorKey: "lastCommunication",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Communication" />
    ),
    cell: ({ row }) => {
      return formatTime(row.getValue("lastCommunication"))
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
