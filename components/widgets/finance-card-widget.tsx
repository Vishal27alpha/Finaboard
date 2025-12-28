"use client"

import type { WidgetConfig } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatValue, getFieldValue } from "@/lib/format-utils"
import { useWidgetData } from "@/hooks/use-widget-data"

interface FinanceCardWidgetProps {
  config: WidgetConfig
}

export function FinanceCardWidget({ config }: FinanceCardWidgetProps) {
  const { data, loading } = useWidgetData(config)

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    )
  }

  const visibleFields = config.fields?.filter((f) => f.visible) || []

  if (visibleFields.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No fields selected. Configure this widget to display data.
        </p>
      </Card>
    )
  }

  // ✅ CARD LOGIC: take the first item only
  const item = data?.[0]

  if (!item) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 space-y-3">
      {visibleFields.map((field) => {
        const value = getFieldValue(item, field.key)

        return (
          <div key={field.key} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{field.label}</span>
            <span className="font-semibold">
              {formatValue(value, field.format)}
            </span>
          </div>
        )
      })}
    </Card>
  )
}
