"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useHabitStore } from "@/store/useHabitStore"
import { motion, AnimatePresence } from "framer-motion"

export default function AddHabitModal() {
  const { setHabits } = useHabitStore()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#22c55e")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)

  const triggerError = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const addHabit = async () => {
    if (!name.trim()) {
      triggerError("Habit name is required")
      return
    }

    setError("")
    setLoading(true)

    const { data, error } = await supabase
      .from("habits")
      .insert({ name, color })
      .select()
      .single()

    if (error) {
      triggerError(error.message)
      setLoading(false)
      return
    }

    setHabits((prev: any[]) => [...prev, data])

    setName("")
    setLoading(false)
    setOpen(false)

    // 🔥 SUCCESS TRIGGER
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addHabit()
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
      >
        + Add Habit
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-neutral-900/90 backdrop-blur-lg border border-white/10 shadow-2xl p-6 rounded-2xl w-full max-w-md space-y-4">

                <h2 className="text-xl font-semibold">
                  Create Habit
                </h2>

                <motion.input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Gym, Reading..."
                  autoFocus
                  animate={
                    shake
                      ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className={`w-full p-3 rounded-lg bg-neutral-800 outline-none ${
                    error
                      ? "border border-red-500"
                      : "border border-transparent"
                  }`}
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">
                    Color
                  </span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addHabit}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold"
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🔥 SUCCESS POP */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed bottom-6 right-6 bg-green-500 text-black px-5 py-3 rounded-xl shadow-xl z-50 font-semibold"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            ✅ Habit Added
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}