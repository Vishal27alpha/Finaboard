"use client"

import { Header } from "@/components/header"
import { AddWidgetDialog } from "@/components/add-widget-dialog"
import { DashboardGrid } from "@/components/dashboard-grid"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="container max-w-screen-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Build your custom finance dashboard with real-time data</p>
            </div>
            <AddWidgetDialog />
          </div>

          <DashboardGrid />
        </div>
      </main>
    </div>
  )
}
