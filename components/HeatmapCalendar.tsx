"use client"

import { useState } from "react"
import { useHabitStore } from "@/store/useHabitStore"
import { motion, AnimatePresence } from "framer-motion"

export default function HeatmapCalendar() {
  const { logs, habits } = useHabitStore()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const today = new Date()
  const days = 84

  const format = (d: Date) => d.toLocaleDateString("en-CA")

  const dates: Date[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    dates.push(d)
  }

  // group weeks
  const weeks: (Date | null)[][] = []
  let week: (Date | null)[] = new Array(7).fill(null)

  dates.forEach((date) => {
    const day = date.getDay()
    week[day] = date

    if (day === 6) {
      weeks.push(week)
      week = new Array(7).fill(null)
    }
  })

  if (week.some((d) => d !== null)) {
    weeks.push(week)
  }

  // logs map
  const logMap: Record<string, number> = {}

  ;(logs || []).forEach((l: any) => {
    if (l.status === "done") {
      logMap[l.date] = (logMap[l.date] || 0) + 1
    }
  })

  const getColor = (count: number) => {
    if (count === 0) return "bg-neutral-800"
    if (count === 1) return "bg-green-900"
    if (count === 2) return "bg-green-700"
    if (count === 3) return "bg-green-500"
    return "bg-green-400"
  }

  // selected day data
  const selectedLogs = logs.filter((l: any) => l.date === selectedDate)

  const completedIds = selectedLogs
    .filter((l: any) => l.status === "done")
    .map((l: any) => l.habit_id)

  const completedHabits = habits.filter((h: any) =>
    completedIds.includes(h.id)
  )

  const missedHabits = habits.filter(
    (h: any) => !completedIds.includes(h.id)
  )

  return (
    <div className="bg-neutral-900 p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Consistency</h2>

      <div className="flex">

        {/* Day labels */}
        <div className="flex flex-col justify-between mr-2 text-xs text-neutral-400 h-[120px]">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        {/* Heatmap */}
        <div className="flex items-end">
          {weeks.map((week, i) => {
            const firstDay = week.find((d) => d !== null) as Date | undefined
            const prevWeek = weeks[i - 1]

            const prevMonth = prevWeek
              ?.find((d) => d !== null)
              ?.getMonth()

            const currentMonth = firstDay?.getMonth()
            const isNewMonth = currentMonth !== prevMonth

            return (
              <div
                key={i}
                className={`flex flex-col gap-[3px] ${
                  isNewMonth ? "ml-3" : "ml-[3px]"
                }`}
              >
                {week.map((date, j) => {
                  if (!date) return <div key={j} className="w-4 h-4" />

                  const formatted = format(date)
                  const count = logMap[formatted] || 0

                  return (
                    <div
                      key={j}
                      onClick={() => setSelectedDate(formatted)}
                      className={`w-4 h-4 rounded-sm cursor-pointer ${getColor(
                        count
                      )} hover:scale-110 transition`}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* 🔥 ANIMATED MODAL */}
      <AnimatePresence>
        {selectedDate && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-neutral-900/90 backdrop-blur-lg p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl border border-white/10">

                <h2 className="text-lg font-semibold">
                  {selectedDate}
                </h2>

                {/* Completed */}
                <div>
                  <h3 className="text-green-400 text-sm mb-1">
                    Completed
                  </h3>
                  {completedHabits.length === 0 ? (
                    <p className="text-neutral-400 text-sm">None</p>
                  ) : (
                    completedHabits.map((h: any) => (
                      <p key={h.id}>{h.name}</p>
                    ))
                  )}
                </div>

                {/* Missed */}
                <div>
                  <h3 className="text-red-400 text-sm mb-1">
                    Missed
                  </h3>
                  {missedHabits.length === 0 ? (
                    <p className="text-neutral-400 text-sm">None</p>
                  ) : (
                    missedHabits.map((h: any) => (
                      <p key={h.id}>{h.name}</p>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-3 px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
                >
                  Close
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}