"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FieldFormat, FormatType } from "@/lib/types"
import { Paintbrush } from "lucide-react"

interface FieldFormatDialogProps {
  fieldLabel: string
  format?: FieldFormat
  onSave: (format: FieldFormat) => void
}

export function FieldFormatDialog({ fieldLabel, format, onSave }: FieldFormatDialogProps) {
  const [open, setOpen] = useState(false)
  const [formatType, setFormatType] = useState<FormatType>(format?.type || "text")
  const [decimals, setDecimals] = useState(format?.decimals?.toString() || "2")
  const [prefix, setPrefix] = useState(format?.prefix || "")
  const [suffix, setSuffix] = useState(format?.suffix || "")
  const [currencySymbol, setCurrencySymbol] = useState(format?.currencySymbol || "$")

  const handleSave = () => {
    const newFormat: FieldFormat = {
      type: formatType,
      ...(formatType === "number" || formatType === "currency" || formatType === "percentage"
        ? { decimals: Number.parseInt(decimals) || 0 }
        : {}),
      ...(formatType === "number" && prefix ? { prefix } : {}),
      ...(formatType === "number" && suffix ? { suffix } : {}),
      ...(formatType === "currency" ? { currencySymbol } : {}),
    }
    onSave(newFormat)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Paintbrush className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Format Field: {fieldLabel}</DialogTitle>
          <DialogDescription>Configure how this field should be displayed</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format-type">Format Type</Label>
            <Select value={formatType} onValueChange={(value) => setFormatType(value as FormatType)}>
              <SelectTrigger id="format-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formatType === "number" || formatType === "currency" || formatType === "percentage") && (
            <div className="space-y-2">
              <Label htmlFor="decimals">Decimal Places</Label>
              <Input
                id="decimals"
                type="number"
                min="0"
                max="10"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
              />
            </div>
          )}

          {formatType === "currency" && (
            <div className="space-y-2">
              <Label htmlFor="currency-symbol">Currency Symbol</Label>
              <Input
                id="currency-symbol"
                placeholder="$"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
              />
            </div>
          )}

          {formatType === "number" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix (optional)</Label>
                <Input
                  id="prefix"
                  placeholder="e.g., $, #"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix (optional)</Label>
                <Input
                  id="suffix"
                  placeholder="e.g., M, B, units"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
              </div>
            </>
          )}

          <Button onClick={handleSave} className="w-full">
            Save Format
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
