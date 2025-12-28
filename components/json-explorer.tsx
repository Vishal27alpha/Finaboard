"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonExplorerProps {
  data: any
  selectedFields: string[]
  onFieldToggle: (path: string, label: string) => void
}

export function JsonExplorer({ data, selectedFields, onFieldToggle }: JsonExplorerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Auto-expand first level
    if (data && typeof data === "object") {
      setExpandedPaths(new Set(Object.keys(data).map((key) => key)))
    }
  }, [data])

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderValue = (value: any, path: string, key: string) => {
    const isSelected = selectedFields.includes(path)
    const isExpandable = value !== null && typeof value === "object"
    const isExpanded = expandedPaths.has(path)

    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button onClick={() => togglePath(path)} className="hover:bg-muted p-1 rounded">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <span className="font-mono text-sm">{key}</span>
            <Badge variant="secondary" className="text-xs">
              Array[{value.length}]
            </Badge>
          </div>
          {isExpanded && value.length > 0 && (
            <div className="ml-6 space-y-1">{renderValue(value[0], `${path}[0]`, "[0]")}</div>
          )}
        </div>
      )
    }

    if (isExpandable) {
      return (
        <div className="space-y-1" key={key}>
          <div className="flex items-center gap-2">
            <button onClick={() => togglePath(path)} className="hover:bg-muted p-1 rounded">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <span className="font-mono text-sm">{key}</span>
            <Badge variant="secondary" className="text-xs">
              Object
            </Badge>
          </div>
          {isExpanded && (
            <div className="ml-6 space-y-1">
             {Object.entries(value).map(([childKey, childValue]) => (
  <div key={childKey}>
    {renderValue(childValue, childKey, childKey)}
  </div>
))}

            </div>
          )}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-auto py-1 px-2", isSelected && "bg-primary/10")}
          onClick={() => onFieldToggle(path, key)}
        >
          {isSelected && <Check className="h-3 w-3 mr-1" />}
          <span className="font-mono text-sm">{key}</span>
          <Badge variant="outline" className="ml-2 text-xs">
            {typeof value}
          </Badge>
        </Button>
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{String(value)}</span>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No data to explore. Add an API endpoint to preview fields.</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 max-h-[400px] overflow-auto">
      <div className="space-y-1">
        {typeof data === "object" && !Array.isArray(data) ? (
          Object.entries(data).map(([key, value]) => <div key={key}>{renderValue(value, key, key)}</div>)
        ) : (
          <p className="text-sm text-muted-foreground">Data must be an object to explore</p>
        )}
      </div>
    </Card>
  )
}
