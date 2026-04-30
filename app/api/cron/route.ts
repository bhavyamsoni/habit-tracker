import { supabase } from "@/lib/supabase"
import type { TablesInsert } from "@/types"

type HabitLogInsert = TablesInsert<"habit_logs">

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]

    // 1. Get habits
    const { data: habits, error: habitError } = await supabase
      .from("habits")
      .select("id")

    if (habitError) {
      console.error("Error fetching habits:", habitError)
      return Response.json({ error: habitError.message }, { status: 500 })
    }

    const habitList = habits || []

    if (habitList.length === 0) {
      return Response.json({
        message: "No habits found",
        date: today,
        recordsInserted: 0,
      })
    }

    // 2. Get today's logs
    const { data: existingLogs, error: logsError } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("date", today)

    if (logsError) {
      console.error("Error fetching logs:", logsError)
      return Response.json({ error: logsError.message }, { status: 500 })
    }

    const existingIds = new Set(
      (existingLogs || []).map((log) => log.habit_id)
    )

    // 3. Prepare missing logs
    const payload: HabitLogInsert[] = habitList
      .filter((h) => !existingIds.has(h.id))
      .map((h) => ({
        habit_id: h.id,
        date: today,
        status: "missed",
      }))

    // 4. Insert (safe)
    let inserted = 0

    if (payload.length > 0) {
      const { error } = await supabase
        .from("habit_logs")
        .upsert(payload, {
          onConflict: "habit_id,date",
        })

      if (error) {
        console.error("Insert failed:", error)
        return Response.json({ error: error.message }, { status: 500 })
      }

      inserted = payload.length
    }

    return Response.json({
      message: "Cron executed",
      inserted,
      date: today,
    })
  } catch (err: any) {
    console.error("Cron crash:", err)

    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}