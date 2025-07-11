"use client"

import * as React from "react"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import type { RitualArtifact, Deck } from "@/lib/types"
import { updateArtifact, deleteArtifact } from "@/app/admin/actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ArtifactDataTableProps {
  initialData: RitualArtifact[]
}

export function ArtifactDataTable({ initialData }: ArtifactDataTableProps) {
  const [artifacts, setArtifacts] = React.useState(initialData)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedArtifact, setSelectedArtifact] = React.useState<RitualArtifact | null>(null)
  const { toast } = useToast()

  const openEditDialog = (artifact: RitualArtifact) => {
    setSelectedArtifact(artifact)
    setIsEditOpen(true)
  }

  const openDeleteDialog = (artifact: RitualArtifact) => {
    setSelectedArtifact(artifact)
    setIsDeleteOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedArtifact) return

    const formData = new FormData(e.currentTarget)
    const updatedArtifact: RitualArtifact = {
      ...selectedArtifact,
      title: formData.get("title") as string,
      deck: formData.get("deck") as Deck,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
    }

    // Optimistic update
    const originalArtifacts = artifacts
    setArtifacts((prev) => prev.map((a) => (a.id === updatedArtifact.id ? updatedArtifact : a)))
    setIsEditOpen(false)

    const { error } = await updateArtifact(updatedArtifact)

    if (error) {
      // Revert on error
      setArtifacts(originalArtifacts)
      toast({
        title: "Error updating artifact",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Artifact Updated",
        description: `${updatedArtifact.title} has been successfully updated.`,
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedArtifact) return

    // Optimistic update
    const originalArtifacts = artifacts
    setArtifacts((prev) => prev.filter((a) => a.id !== selectedArtifact.id))
    setIsDeleteOpen(false)

    const { error } = await deleteArtifact(selectedArtifact.id)

    if (error) {
      // Revert on error
      setArtifacts(originalArtifacts)
      toast({
        title: "Error deleting artifact",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Artifact Deleted",
        description: `${selectedArtifact.title} has been successfully deleted.`,
      })
    }
  }

  const columns = React.useMemo(() => getColumns(openEditDialog, openDeleteDialog), [])

  return (
    <>
      <DataTable columns={columns} data={artifacts} />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-sm border-teal-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Edit Artifact: {selectedArtifact?.title}</DialogTitle>
            <DialogDescription>Make changes to the artifact details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={selectedArtifact?.title}
                  className="col-span-3 bg-gray-900 border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={selectedArtifact?.tags.join(", ")}
                  className="col-span-3 bg-gray-900 border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deck" className="text-right">
                  Deck
                </Label>
                <select
                  id="deck"
                  name="deck"
                  defaultValue={selectedArtifact?.deck}
                  className="col-span-3 bg-gray-900 border-gray-700 rounded-md p-2"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="Vault">Vault</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/40 transition-all"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-black/80 backdrop-blur-sm border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this artifact?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the artifact "{selectedArtifact?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 transition-all"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
