import { supabase } from "@/lib/supabase"

// Explicit types (fixes TS "never" issues)
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

    // Fetch all habits
    const { data: habits, error: habitError } = await supabase
      .from("habits")
      .select("id")

    if (habitError) {
      console.error("Error fetching habits:", habitError)
      return Response.json({ error: habitError.message }, { status: 500 })
    }

    const habitList = (habits || []) as Habit[]

    // Loop through each habit
    for (const habit of habitList) {
      // Check if today's log already exists
      const { data: existing, error: existingError } = await supabase
        .from("habit_logs")
        .select("id")
        .eq("habit_id", habit.id)
        .eq("date", today)
        .maybeSingle()

      if (existingError) {
        console.error("Error checking existing log:", existingError)
        continue
      }

      // If no log → mark as missed
      if (!existing) {
        const payload: HabitLog = {
          habit_id: habit.id,
          date: today,
          status: "missed",
        }

        const { error: insertError } = await supabase
          .from("habit_logs")
          .insert([payload] as any) // force-cast to bypass TS schema issues

        if (insertError) {
          console.error("Insert failed:", insertError)
        } else {
          console.log(`Missed logged for habit ${habit.id} on ${today}`)
        }
      }
    }

    console.log("Cron executed successfully at:", new Date())

    return Response.json({
      message: "Cron executed successfully",
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