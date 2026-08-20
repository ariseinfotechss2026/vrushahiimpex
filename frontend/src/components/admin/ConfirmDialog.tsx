import type { ReactElement } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  trigger: ReactElement
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
}

export function ConfirmDialog({ trigger, title, description, onConfirm, confirmLabel = "Delete" }: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="destructive" onClick={onConfirm} />}>{confirmLabel}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
