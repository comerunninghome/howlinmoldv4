"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { RitualArtifact } from "@/lib/types"

export const getColumns = (
  openEditDialog: (artifact: RitualArtifact) => void,
  openDeleteDialog: (artifact: RitualArtifact) => void,
): ColumnDef<RitualArtifact>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "deck",
    header: "Deck",
    cell: ({ row }) => {
      const deck = row.getValue("deck") as string
      const variant = deck === "Vault" ? "destructive" : deck === "A" ? "default" : "secondary"
      return <Badge variant={variant}>{deck}</Badge>
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-teal-400/50 text-teal-300">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "dateCanonized",
    header: "Canonized",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateCanonized"))
      return <span>{date.toLocaleDateString()}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const artifact = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black border-teal-500/30 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openEditDialog(artifact)}>Edit Artifact</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteDialog(artifact)}
              className="text-red-400 focus:bg-red-900/50 focus:text-white"
            >
              Delete Artifact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
