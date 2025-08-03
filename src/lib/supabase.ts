import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "user" | "agent" | "admin"
          status: "active" | "inactive" | "suspended"
          avatar_url: string | null
          phone: string | null
          location: string | null
          bio: string | null
          company: string | null
          department: string | null
          permissions: string[] | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "user" | "agent" | "admin"
          status?: "active" | "inactive" | "suspended"
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          company?: string | null
          department?: string | null
          permissions?: string[] | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "user" | "agent" | "admin"
          status?: "active" | "inactive" | "suspended"
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          company?: string | null
          department?: string | null
          permissions?: string[] | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_number: string
          subject: string
          description: string
          status: "open" | "in-progress" | "resolved" | "closed"
          priority: "low" | "medium" | "high" | "critical"
          category_id: string | null
          customer_id: string
          assigned_to: string | null
          tags: string[] | null
          attachments: string[] | null
          upvotes: number
          downvotes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number?: string
          subject: string
          description: string
          status?: "open" | "in-progress" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "critical"
          category_id?: string | null
          customer_id: string
          assigned_to?: string | null
          tags?: string[] | null
          attachments?: string[] | null
          upvotes?: number
          downvotes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          subject?: string
          description?: string
          status?: "open" | "in-progress" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "critical"
          category_id?: string | null
          customer_id?: string
          assigned_to?: string | null
          tags?: string[] | null
          attachments?: string[] | null
          upvotes?: number
          downvotes?: number
          created_at?: string
          updated_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          ticket_id: string
          author_id: string
          message: string
          attachments: string[] | null
          is_internal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          author_id: string
          message: string
          attachments?: string[] | null
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          author_id?: string
          message?: string
          attachments?: string[] | null
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          ticket_id: string
          user_id: string
          vote_type: "up" | "down"
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id: string
          vote_type: "up" | "down"
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string
          vote_type?: "up" | "down"
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          tickets_created: number
          tickets_resolved: number
          avg_response_time: number
          customer_rating: number
          total_replies: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tickets_created?: number
          tickets_resolved?: number
          avg_response_time?: number
          customer_rating?: number
          total_replies?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tickets_created?: number
          tickets_resolved?: number
          avg_response_time?: number
          customer_rating?: number
          total_replies?: number
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
