"use client"

import type React from "react"
import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Settings, X } from "lucide-react"
import type { Widget } from "@/lib/types"
import { cn } from "@/lib/utils"
import { WidgetSettingsDialog } from "./widget-settings-dialog"

interface WidgetContainerProps {
  widget: Widget
  onRemove: () => void
  children: React.ReactNode
}

export function WidgetContainer({ widget, onRemove, children }: WidgetContainerProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <>
      <div ref={setNodeRef} style={style} className={cn(isDragging && "z-50 opacity-50")}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <h3 className="font-semibold">{widget.title}</h3>
                {widget.description && <p className="text-xs text-muted-foreground">{widget.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configure widget</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onRemove}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove widget</span>
              </Button>
            </div>
          </div>
          <div className="p-4">{children}</div>
        </Card>
      </div>

      <WidgetSettingsDialog widget={widget} open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
