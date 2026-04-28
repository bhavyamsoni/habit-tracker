import { supabase } from "@/lib/supabase"

export async function GET() {
  const today = new Date().toISOString().split("T")[0]

  const { data: habits } = await supabase
    .from("habits")
    .select("id")

  for (const habit of habits || []) {
    const { data: existing } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habit.id)
      .eq("date", today)
      .maybeSingle()

    if (!existing) {
      await supabase.from("habit_logs").insert({
        habit_id: habit.id,
        date: today,
        status: "missed",
      })
    }
  }

  return Response.json({ message: "Cron executed" })
}