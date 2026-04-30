import { supabase } from "@/lib/supabase"

// simple type to stop TS from crying
type Habit = {
  id: string
}

export async function GET() {
  try {
    const today = new Date().toLocaleDateString("en-CA")

    // fetch all habits
    const { data: habits, error: habitError } = await supabase
      .from("habits")
      .select("id")

    if (habitError) {
      return Response.json(
        { error: habitError.message },
        { status: 500 }
      )
    }

    const habitList = (habits || []) as Habit[]

    for (const habit of habitList) {
      // check if log already exists
      const { data: existing } = await supabase
        .from("habit_logs")
        .select("id")
        .eq("habit_id", habit.id)
        .eq("date", today)
        .maybeSingle()

      // if not → mark as missed
      if (!existing) {
        await supabase.from("habit_logs").insert([
          {
            habit_id: habit.id,
            date: today,
            status: "missed",
          },
        ] as any) // 👈 critical fix for TS error
      }
    }

    return Response.json({ message: "Cron executed successfully" })
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    )
  }
}