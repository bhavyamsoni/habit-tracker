export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      habit_logs: {
        Row: {
          created_at: string | null
          date: string
          habit_id: string | null
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          habit_id?: string | null
          id?: string
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          habit_id?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          frequency: string[] | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string[] | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string[] | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          date: string
          habit_id: string | null
          id: string
          status: string | null
        }
        Insert: {
          date: string
          habit_id?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          date?: string
          habit_id?: string | null
          id?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema =
  DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T] extends {
  Update: infer U
}
  ? U
  : never