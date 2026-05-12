/*"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { JsonExplorer } from "./json-explorer"
import { FieldFormatDialog } from "./field-format-dialog"
import type { Widget, FieldConfig } from "@/lib/types"
import { useDashboardStore } from "@/lib/store"
import { Trash2 } from "lucide-react"

interface WidgetSettingsDialogProps {
  widget: Widget
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WidgetSettingsDialog({ widget, open, onOpenChange }: WidgetSettingsDialogProps) {
  const updateWidget = useDashboardStore((state) => state.updateWidget)
  const [title, setTitle] = useState(widget.title)
  const [description, setDescription] = useState(widget.description || "")
  const [apiEndpoint, setApiEndpoint] = useState(widget.config.apiEndpoint || "")
  const [dataPath, setDataPath] = useState(widget.config.dataPath || "")
  const [fields, setFields] = useState<FieldConfig[]>(widget.config.fields || [])
  const [previewData, setPreviewData] = useState<any>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const isDirectIndianApiUrl = /https?:\/\/stock\.indianapi\.in/i.test(apiEndpoint.trim())

  const handleFieldToggle = (path: string, label: string) => {
    setFields((prev) => {
      const existing = prev.find((f) => f.key === path)
      if (existing) {
        return prev.filter((f) => f.key !== path)
      }
      return [
        ...prev,
        {
          key: path,
          label,
          visible: true,
          sortable: true,
        },
      ]
    })
  }

  const handleFieldFormatUpdate = (fieldKey: string, format: any) => {
    setFields((prev) => prev.map((f) => (f.key === fieldKey ? { ...f, format } : f)))
  }

  const handleFieldVisibilityToggle = (fieldKey: string) => {
    setFields((prev) => prev.map((f) => (f.key === fieldKey ? { ...f, visible: !f.visible } : f)))
  }

  const handleFieldRemove = (fieldKey: string) => {
    setFields((prev) => prev.filter((f) => f.key !== fieldKey))
  }

  const loadPreview = async () => {
    if (!apiEndpoint) return

    setIsLoadingPreview(true)
    try {
      const response = await fetch(apiEndpoint)
      const data = await response.json()

      // If dataPath is specified, navigate to that path in the response
      let targetData = data
      if (dataPath) {
        const pathParts = dataPath.split(".")
        for (const part of pathParts) {
          targetData = targetData?.[part]
        }
      }

      // If it's an array, take the first item for preview
      if (Array.isArray(targetData) && targetData.length > 0) {
        targetData = targetData[0]
      }

      setPreviewData(targetData)
    } catch (error) {
      console.error("[v0] Failed to load preview:", error)
      setPreviewData(null)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleSave = () => {
    updateWidget(widget.id, {
      title,
      description,
      config: {
        ...widget.config,
        apiEndpoint,
        dataPath,
        fields,
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Widget Settings</DialogTitle>
          <DialogDescription>Customize your widget appearance and data sources</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API & Data</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input id="widget-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-description">Description (optional)</Label>
              <Textarea
                id="widget-description"
                placeholder="Add a description for this widget..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com/data"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a custom API endpoint to fetch data from external sources
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-path">Data Path (optional)</Label>
              <Input
                id="data-path"
                placeholder="e.g., data.results or items"
                value={dataPath}
                onChange={(e) => setDataPath(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Dot notation path to the data in the API response (e.g., "data.items")
              </p>
            </div>

            <Button onClick={loadPreview} disabled={!apiEndpoint || isLoadingPreview}>
              {isLoadingPreview ? "Loading..." : "Load Preview"}
            </Button>

            {previewData && (
              <div className="space-y-2">
                <Label>API Response Preview</Label>
                <div className="text-xs font-mono bg-muted p-3 rounded-md max-h-[200px] overflow-auto">
                  <pre>{JSON.stringify(previewData, null, 2)}</pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            {previewData ? (
              <>
                <div>
                  <Label>Select Fields from API Response</Label>
                  <p className="text-xs text-muted-foreground mb-2">Click on fields to add them to your widget</p>
                  <JsonExplorer
                    data={previewData}
                    selectedFields={fields.map((f) => f.key)}
                    onFieldToggle={handleFieldToggle}
                  />
                </div>

                {fields.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Fields</Label>
                    <div className="space-y-2">
                      {fields.map((field) => (
                        <div key={field.key} className="flex items-center gap-2 p-2 border rounded-md">
                          <Switch
                            checked={field.visible}
                            onCheckedChange={() => handleFieldVisibilityToggle(field.key)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{field.label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{field.key}</p>
                            {field.format && (
                              <p className="text-xs text-muted-foreground">
                                Format: {field.format.type}
                                {field.format.decimals !== undefined && ` (${field.format.decimals} decimals)`}
                              </p>
                            )}
                          </div>
                          <FieldFormatDialog
                            fieldLabel={field.label}
                            format={field.format}
                            onSave={(format) => handleFieldFormatUpdate(field.key, format)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleFieldRemove(field.key)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Configure an API endpoint and load preview data to select fields
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}*/
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { JsonExplorer } from "./json-explorer"
import { FieldFormatDialog } from "./field-format-dialog"
import type { Widget, FieldConfig } from "@/lib/types"
import { useDashboardStore } from "@/lib/store"
import { Trash2 } from "lucide-react"

interface WidgetSettingsDialogProps {
  widget: Widget
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WidgetSettingsDialog({ widget, open, onOpenChange }: WidgetSettingsDialogProps) {
  const updateWidget = useDashboardStore((state) => state.updateWidget)

  const [title, setTitle] = useState(widget.title)
  const [description, setDescription] = useState(widget.description || "")

  const [apiEndpoint, setApiEndpoint] = useState(widget.config.apiEndpoint || "")
  const [dataPath, setDataPath] = useState(widget.config.dataPath || "")

  // ✅ REFRESH INTERVAL STATE (seconds)
  const [refreshInterval, setRefreshInterval] = useState<number>(
    widget.config.refreshInterval ?? 30
  )

  const [fields, setFields] = useState<FieldConfig[]>(widget.config.fields || [])
  const [previewData, setPreviewData] = useState<any>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const isDirectIndianApiUrl = /https?:\/\/stock\.indianapi\.in/i.test(apiEndpoint.trim())

  const handleFieldToggle = (path: string, label: string) => {
    setFields((prev) => {
      const existing = prev.find((f) => f.key === path)
      if (existing) return prev.filter((f) => f.key !== path)

      return [
        ...prev,
        { key: path, label, visible: true, sortable: true },
      ]
    })
  }

  const handleFieldFormatUpdate = (fieldKey: string, format: any) => {
    setFields((prev) => prev.map((f) => (f.key === fieldKey ? { ...f, format } : f)))
  }

  const handleFieldVisibilityToggle = (fieldKey: string) => {
    setFields((prev) =>
      prev.map((f) => (f.key === fieldKey ? { ...f, visible: !f.visible } : f))
    )
  }

  const handleFieldRemove = (fieldKey: string) => {
    setFields((prev) => prev.filter((f) => f.key !== fieldKey))
  }

  const loadPreview = async () => {
    if (!apiEndpoint) return
    setIsLoadingPreview(true)

    try {
      const response = await fetch(apiEndpoint)
      let data = await response.json()

      if (dataPath) {
        for (const part of dataPath.split(".")) {
          data = data?.[part]
        }
      }

      if (Array.isArray(data)) data = data[0]
      setPreviewData(data)
    } catch {
      setPreviewData(null)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleSave = () => {
    updateWidget(widget.id, {
      title,
      description,
      config: {
        ...widget.config,
        apiEndpoint,
        dataPath,
        refreshInterval, // ✅ SAVED HERE
        fields,
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Widget Settings</DialogTitle>
          <DialogDescription>
            Customize your widget appearance and data sources
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API & Data</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          {/* -------- GENERAL -------- */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label>Widget Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* -------- API & DATA -------- */}
          <TabsContent value="api" className="space-y-4">
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <Input value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                For authenticated providers, use local routes like
                {" "}
                <span className="font-mono">/api/indian-stock?name=Reliance</span>
                {" "}
                instead of the provider&apos;s direct URL.
              </p>
              {isDirectIndianApiUrl && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  This provider requires a server-side proxy. Use
                  {" "}
                  <span className="font-mono">/api/indian-stock?name=...</span>
                  {" "}
                  instead of the direct IndianAPI URL.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data Path</Label>
              <Input value={dataPath} onChange={(e) => setDataPath(e.target.value)} />
            </div>

            {/* ✅ REFRESH INTERVAL (HERE AS REQUESTED) */}
            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Input
                type="number"
                min={5}
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Widget will auto-refresh at this interval
              </p>
            </div>

            <Button onClick={loadPreview} disabled={!apiEndpoint || isLoadingPreview}>
              {isLoadingPreview ? "Loading..." : "Load Preview"}
            </Button>

            {previewData && (
              <pre className="text-xs bg-muted p-3 rounded-md max-h-[200px] overflow-auto">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            )}
          </TabsContent>

          {/* -------- FIELDS -------- */}
          <TabsContent value="fields">
            {previewData ? (
              <>
                <JsonExplorer
                  data={previewData}
                  selectedFields={fields.map((f) => f.key)}
                  onFieldToggle={handleFieldToggle}
                />

                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 p-2 border rounded-md">
                    <Switch
                      checked={field.visible}
                      onCheckedChange={() => handleFieldVisibilityToggle(field.key)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{field.label}</p>
                      <p className="text-xs font-mono text-muted-foreground">{field.key}</p>
                    </div>
                    <FieldFormatDialog
                      fieldLabel={field.label}
                      format={field.format}
                      onSave={(format) => handleFieldFormatUpdate(field.key, format)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleFieldRemove(field.key)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Load preview data to select fields
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
