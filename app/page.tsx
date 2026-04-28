"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useHabitStore } from "@/store/useHabitStore"

import HabitList from "@/components/HabitList"
import Dashboard from "@/components/Dashboard"
import AddHabitModal from "@/components/AddHabitModal"
import HeatmapCalendar from "@/components/HeatmapCalendar"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

export default function Home() {
  const { setHabits, setLogs } = useHabitStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: habits } = await supabase.from("habits").select("*")
    const { data: logs } = await supabase.from("habit_logs").select("*")

    setHabits(Array.isArray(habits) ? habits : [])
    setLogs(Array.isArray(logs) ? logs : [])
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-neutral-900 px-6 py-4 rounded-2xl shadow"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Flame className="text-orange-400" size={26} />
              Habit Tracker
            </h1>
            <p className="text-sm text-neutral-400">
              Build consistency daily
            </p>
          </div>

          <AddHabitModal />
        </motion.div>

        {/* DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Dashboard />
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HabitList />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HeatmapCalendar />
          </motion.div>

        </div>

      </div>
    </main>
  )
}