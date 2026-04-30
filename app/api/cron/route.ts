import { supabase } from "@/lib/supabase"

type Habit = {
  id?: string
  name: string
  color: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = body.name?.trim()
    const color = body.color || "#22c55e"

    // Basic validation
    if (!name) {
      return Response.json(
        { error: "Habit name is required" },
        { status: 400 }
      )
    }

    const payload: Habit = {
      name,
      color,
    }

    const { data, error } = await supabase
      .from("habits")
      // ✅ FIX: array + cast
      .insert([payload] as any)
      .select()
      .single()

    if (error) {
      console.error("Insert habit failed:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
  } catch (err: any) {
    console.error("Habit API crash:", err)

    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}