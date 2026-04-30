import { supabase } from "@/lib/supabase"

type Habit = {
  id: string
}

export async function GET() {
  const today = new Date().toLocaleDateString("en-CA")

  const { data: habits, error } = await supabase
    .from("habits")
    .select("id")

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // 👇 FIX: tell TS what habits are
  const habitList = (habits || []) as Habit[]

  for (const habit of habitList) {
    const { data: existing } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habit.id)
      .eq("date", today)
      .maybeSingle()

    if (!existing) {
      await supabase.from("habit_logs").insert([
        {
          habit_id: habit.id,
          date: today,
          status: "missed",
        },
      ] as any)
    }
  }

  return Response.json({ message: "Cron executed" })
}