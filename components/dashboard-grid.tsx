"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDashboardStore } from "@/lib/store"
import { WidgetContainer } from "./widget-container"
import { StockTableWidget } from "./widgets/stock-table-widget"
import { FinanceCardWidget } from "./widgets/finance-card-widget"
import { ChartWidget } from "./widgets/chart-widget"
import type { Widget } from "@/lib/types"

export function DashboardGrid() {
  const { widgets, removeWidget, reorderWidgets } = useDashboardStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id)
      const newIndex = widgets.findIndex((w) => w.id === over.id)
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex))
    }
  }

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "table":
        return <StockTableWidget config={widget.config} />
      case "card":
        return <FinanceCardWidget config={widget.config} />
      case "chart":
        return <ChartWidget config={widget.config} />
      default:
        return <div>Unknown widget type</div>
    }
  }

  if (widgets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Add widgets to start building your dashboard</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map((widget) => (
            <WidgetContainer key={widget.id} widget={widget} onRemove={() => removeWidget(widget.id)}>
              {renderWidgetContent(widget)}
            </WidgetContainer>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
