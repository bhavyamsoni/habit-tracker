import { supabase } from "@/lib/supabase"

// Explicit types
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
    // Always use ISO format (safe for DB comparisons)
    const today = new Date().toISOString().split("T")[0]

    // 1. Fetch ALL habits at once
    const { data: habits, error: habitError } = await supabase
      .from("habits")
      .select("id")

    if (habitError) {
      console.error("Error fetching habits:", habitError)
      return Response.json({ error: habitError.message }, { status: 500 })
    }

    const habitList = (habits || []) as Habit[]

    // 2. Fetch ALL existing logs for today at once
    const { data: existingLogs, error: logsError } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("date", today)

    if (logsError) {
      console.error("Error fetching today's logs:", logsError)
      return Response.json({ error: logsError.message }, { status: 500 })
    }

    // 3. Create a Set of habit IDs that already have a log today
    // Using a Set makes the lookup O(1) instead of O(N)
    const existingHabitIds = new Set(existingLogs?.map(log => log.habit_id))

    // 4. Filter out habits that already have logs, and prepare the insert payload
    const missingLogsPayload: HabitLog[] = habitList
      .filter(habit => !existingHabitIds.has(habit.id))
      .map(habit => ({
        habit_id: habit.id,
        date: today,
        status: "missed",
      }))

    // 5. Bulk insert the missed logs (Only run if there are actual missing logs)
    if (missingLogsPayload.length > 0) {
      const { error: insertError } = await supabase
        .from("habit_logs")
        // Note: Using `as any` to bypass TS until you generate Supabase schema types
        .insert(missingLogsPayload as any) 

      if (insertError) {
        console.error("Bulk insert failed:", insertError)
        return Response.json({ error: insertError.message }, { status: 500 })
      }
      
      console.log(`Successfully logged ${missingLogsPayload.length} missed habits for ${today}.`)
    } else {
      console.log(`All habits are up to date for ${today}. Nothing to log!`)
    }

    console.log("Cron executed successfully at:", new Date())

    return Response.json({
      message: "Cron executed successfully",
      date: today,
      recordsInserted: missingLogsPayload.length
    })

  } catch (err: any) {
    console.error("Cron crash:", err)

    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}