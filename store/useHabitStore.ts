import { create } from "zustand"

type Habit = {
  id: number | string
  name: string
  color?: string
}

type Log = {
  id: number | string
  habit_id: number | string
  date: string
  status: "done" | "missed"
}

type Store = {
  habits: Habit[]
  logs: Log[]
  setHabits: (habits: Habit[]) => void
  setLogs: (logs: Log[]) => void
}

export const useHabitStore = create<Store>((set) => ({
  habits: [],        // ✅ ALWAYS ARRAY
  logs: [],

  setHabits: (habits) =>
    set({ habits: Array.isArray(habits) ? habits : [] }),

  setLogs: (logs) =>
    set({ logs: Array.isArray(logs) ? logs : [] }),
}))