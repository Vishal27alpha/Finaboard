/*"use client"

import { useEffect, useState } from "react"
import type { WidgetConfig } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatValue, getFieldValue } from "@/lib/format-utils"
import { useWidgetData } from "@/hooks/use-widget-data"

interface StockTableWidgetProps {
  config: WidgetConfig
}

export function StockTableWidget({ config }: StockTableWidgetProps) {
  const { data, loading } = useWidgetData(config)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter((item) =>
          config.fields?.some((field) => {
            // const value = getFieldValue(item, field.key)
            const resolvedItem = config.dataPath ? item[config.dataPath] : item
const value = getFieldValue(resolvedItem, field.key)

            return String(value).toLowerCase().includes(searchQuery.toLowerCase())
          }),
        ),
      )
    } else {
      setFilteredData(data)
    }
  }, [searchQuery, data, config.fields])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const visibleFields = config.fields?.filter((f) => f.visible) || []

  if (visibleFields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No fields selected. Configure this widget to display data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleFields.map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleFields.length} className="text-center text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  {visibleFields.map((field) => {
                    //const value = getFieldValue(item, field.key)
                    const resolvedItem = config.dataPath ? item[config.dataPath] : item
                    const value = getFieldValue(resolvedItem, field.key)
                    

                    return <TableCell key={field.key}>{formatValue(value, field.format)}</TableCell>
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}*/
"use client"

import { useEffect, useState } from "react"
import type { WidgetConfig } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatValue, getFieldValue } from "@/lib/format-utils"
import { useWidgetData } from "@/hooks/use-widget-data"

interface StockTableWidgetProps {
  config: WidgetConfig
}

export function StockTableWidget({ config }: StockTableWidgetProps) {
  const { data, loading } = useWidgetData(config)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data)
      return
    }

    const q = searchQuery.toLowerCase()
    setFilteredData(
      data.filter((item) =>
        config.fields?.some((field) =>
          String(getFieldValue(item, field.key) ?? "")
            .toLowerCase()
            .includes(q),
        ),
      ),
    )
  }, [searchQuery, data, config.fields])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const visibleFields = config.fields?.filter((f) => f.visible) || []

  if (visibleFields.length === 0) {
    return <div className="py-6 text-center text-muted-foreground">No fields selected</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleFields.map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                {visibleFields.map((field) => {
                  const value = getFieldValue(item, field.key)
                  return (
                    <TableCell key={field.key}>
                      {formatValue(value, field.format)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

