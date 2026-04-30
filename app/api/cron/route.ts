import { supabase } from "@/lib/supabase"

// Types
type Habit = {
  id: string
}

type HabitLog = {
  habit_id: string
  date: string
  status: "done" | "missed"
}

export async function GET() {
  try {
    // ✅ Use consistent UTC date (same as DB)
    const today = new Date().toISOString().split("T")[0]

    // 1️⃣ Fetch all habits
    const { data: habits, error: habitError } = await supabase
      .from("habits")
      .select("id")

    if (habitError) {
      console.error("Error fetching habits:", habitError)
      return Response.json({ error: habitError.message }, { status: 500 })
    }

    const habitList = (habits || []) as Habit[]

    if (habitList.length === 0) {
      return Response.json({
        message: "No habits found",
        date: today,
        recordsInserted: 0,
      })
    }

    // 2️⃣ Fetch today's existing logs
    const { data: existingLogs, error: logsError } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("date", today)

    if (logsError) {
      console.error("Error fetching today's logs:", logsError)
      return Response.json({ error: logsError.message }, { status: 500 })
    }

    const existingHabitIds = new Set(
      (existingLogs || []).map((log: any) => log.habit_id)
    )

    // 3️⃣ Prepare missing logs
    const missingLogsPayload: HabitLog[] = habitList
      .filter((habit) => !existingHabitIds.has(habit.id))
      .map((habit) => ({
        habit_id: habit.id,
        date: today,
        status: "missed",
      }))

    // 4️⃣ Insert safely using UPSERT (prevents duplicates)
    let insertedCount = 0

    if (missingLogsPayload.length > 0) {
      const { error: insertError } = await supabase
        .from("habit_logs")
        .upsert(missingLogsPayload as any, {
          onConflict: "habit_id,date",
        })

      if (insertError) {
        console.error("Upsert failed:", insertError)
        return Response.json({ error: insertError.message }, { status: 500 })
      }

      insertedCount = missingLogsPayload.length
      console.log(
        `Inserted ${insertedCount} missed logs for ${today}`
      )
    } else {
      console.log(`No missing logs for ${today}`)
    }

    console.log("Cron executed at:", new Date().toISOString())

    return Response.json({
      message: "Cron executed successfully",
      date: today,
      recordsInserted: insertedCount,
    })
  } catch (err: any) {
    console.error("Cron crash:", err)

    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}