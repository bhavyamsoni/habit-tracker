"use client"

import { useHabitStore } from "@/store/useHabitStore"

export default function Dashboard() {
  const { habits, logs } = useHabitStore()

  const today = new Date().toISOString().split("T")[0]

  const todayLogs = logs.filter((l: any) => l.date === today)

  const completed = todayLogs.filter(
    (l: any) => l.status === "done"
  ).length

  const total = habits.length || 1

  const percent = Math.round((completed / total) * 100)

  return (
    <div className="bg-neutral-900 p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-3">Today Progress</h2>

      <div className="text-3xl font-bold">{percent}%</div>

      <div className="w-full bg-neutral-800 h-3 rounded mt-3">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm text-neutral-400 mt-2">
        {completed} of {total} habits completed
      </p>
    </div>
  )
}