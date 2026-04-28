"use client"

import { useState } from "react"
import { useHabitStore } from "@/store/useHabitStore"
import { supabase } from "@/lib/supabase"

export default function HabitList() {
  const { habits, logs, setHabits, setLogs } = useHabitStore()

  const [editing, setEditing] = useState<any>(null)
  const [newName, setNewName] = useState("")

  const today = new Date().toISOString().split("T")[0]

  // ✅ MARK DONE
  const markDone = async (habitId: any) => {
    const already = logs.some(
      (l: any) => l.habit_id === habitId && l.date === today
    )
    if (already) return

    const { data, error } = await supabase
      .from("habit_logs")
      .insert({
        habit_id: habitId,
        date: today,
        status: "done",
      })
      .select()
      .single()

    if (!error && data) {
      setLogs((prev: any[]) => [...prev, data])
    }
  }

  // ✅ DELETE
  const deleteHabit = async (id: any) => {
    if (!confirm("Delete this habit?")) return

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)

    if (!error) {
      setHabits((prev: any[]) => prev.filter((h) => h.id !== id))

      // optional: remove logs also from UI
      setLogs((prev: any[]) =>
        prev.filter((l) => l.habit_id !== id)
      )
    }
  }

  // ✅ START EDIT
  const startEdit = (habit: any) => {
    setEditing(habit.id)
    setNewName(habit.name)
  }

  // ✅ SAVE EDIT
  const saveEdit = async (id: any) => {
    if (!newName.trim()) return

    const { data, error } = await supabase
      .from("habits")
      .update({ name: newName })
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setHabits((prev: any[]) =>
        prev.map((h) => (h.id === id ? data : h))
      )
    }

    setEditing(null)
    setNewName("")
  }

  return (
    <div className="bg-neutral-900 p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Habits</h2>

      <div className="space-y-3">
        {(habits || []).map((h: any) => {
          const done = logs.some(
            (l: any) => l.habit_id === h.id && l.date === today
          )

          return (
            <div
              key={h.id}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-800"
            >
              {/* LEFT SIDE */}
              {editing === h.id ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-neutral-700 px-2 py-1 rounded"
                />
              ) : (
                <span>{h.name}</span>
              )}

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-2">

                {/* DONE */}
                <button
                  onClick={() => markDone(h.id)}
                  disabled={done}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    done
                      ? "bg-green-500 text-black"
                      : "bg-neutral-700 hover:bg-neutral-600"
                  }`}
                >
                  {done ? "Done" : "Mark"}
                </button>

                {/* EDIT */}
                {editing === h.id ? (
                  <button
                    onClick={() => saveEdit(h.id)}
                    className="px-2 py-1 bg-blue-500 rounded text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(h)}
                    className="px-2 py-1 bg-yellow-500 rounded text-sm text-black"
                  >
                    Edit
                  </button>
                )}

                {/* DELETE */}
                <button
                  onClick={() => deleteHabit(h.id)}
                  className="px-2 py-1 bg-red-500 rounded text-sm"
                >
                  Delete
                </button>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}