import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Widget } from "./types"

interface DashboardState {
  widgets: Widget[]
  addWidget: (widget: Widget) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  reorderWidgets: (widgets: Widget[]) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [],
      addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
      removeWidget: (id) => set((state) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      reorderWidgets: (widgets) => set({ widgets }),
    }),
    {
      name: "finboard-dashboard",
    },
  ),
)
