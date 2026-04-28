"use client"

import { useHabitStore } from "@/store/useHabitStore"

export default function CalendarView() {
  const { logs } = useHabitStore()

  return (
    <div className="bg-neutral-900 p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Activity</h2>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {logs.map((log: any) => (
          <div
            key={log.id}
            className={`p-2 rounded text-sm ${
              log.status === "done"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {log.date} — {log.status}
          </div>
        ))}
      </div>
    </div>
  )
}