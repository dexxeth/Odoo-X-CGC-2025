import { supabase } from "./supabase"
import type { Inserts, Updates } from "./supabase"

// User operations
export const userService = {
  async getAll() {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) throw error
    return data
  },

  async create(user: Inserts<"users">) {
    const { data, error } = await supabase.from("users").insert(user).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Updates<"users">) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error
  },

  async updateLastLogin(id: string) {
    const { error } = await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", id)

    if (error) throw error
  },
}

// Category operations
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("name")

    if (error) throw error
    return data
  },

  async create(category: Inserts<"categories">) {
    const { data, error } = await supabase.from("categories").insert(category).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Updates<"categories">) {
    const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", id)

    if (error) throw error
  },
}

// Ticket operations
export const ticketService = {
  async getAll(filters?: {
    status?: string
    priority?: string
    category_id?: string
    customer_id?: string
    assigned_to?: string
  }) {
    let query = supabase
      .from("tickets")
      .select(`
        *,
        customer:users!tickets_customer_id_fkey(id, name, email),
        assigned_user:users!tickets_assigned_to_fkey(id, name, email),
        category:categories(id, name, color),
        replies(id, message, author_id, created_at, author:users(name, role))
      `)
      .order("created_at", { ascending: false })

    if (filters) {
      if (filters.status) query = query.eq("status", filters.status)
      if (filters.priority) query = query.eq("priority", filters.priority)
      if (filters.category_id) query = query.eq("category_id", filters.category_id)
      if (filters.customer_id) query = query.eq("customer_id", filters.customer_id)
      if (filters.assigned_to) query = query.eq("assigned_to", filters.assigned_to)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        customer:users!tickets_customer_id_fkey(id, name, email, avatar_url),
        assigned_user:users!tickets_assigned_to_fkey(id, name, email, avatar_url),
        category:categories(id, name, color),
        replies(
          id, 
          message, 
          attachments, 
          is_internal, 
          created_at,
          author:users(id, name, email, role, avatar_url)
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async create(ticket: Inserts<"tickets">) {
    const { data, error } = await supabase
      .from("tickets")
      .insert(ticket)
      .select(`
        *,
        customer:users!tickets_customer_id_fkey(id, name, email),
        category:categories(id, name, color)
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Updates<"tickets">) {
    const { data, error } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        customer:users!tickets_customer_id_fkey(id, name, email),
        assigned_user:users!tickets_assigned_to_fkey(id, name, email),
        category:categories(id, name, color)
      `)
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("tickets").delete().eq("id", id)

    if (error) throw error
  },

  async search(query: string, filters?: any) {
    let dbQuery = supabase
      .from("tickets")
      .select(`
        *,
        customer:users!tickets_customer_id_fkey(id, name, email),
        assigned_user:users!tickets_assigned_to_fkey(id, name, email),
        category:categories(id, name, color)
      `)
      .or(`subject.ilike.%${query}%,description.ilike.%${query}%,ticket_number.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (filters) {
      if (filters.status) dbQuery = dbQuery.eq("status", filters.status)
      if (filters.priority) dbQuery = dbQuery.eq("priority", filters.priority)
      if (filters.category_id) dbQuery = dbQuery.eq("category_id", filters.category_id)
    }

    const { data, error } = await dbQuery

    if (error) throw error
    return data
  },
}

// Reply operations
export const replyService = {
  async getByTicketId(ticketId: string) {
    const { data, error } = await supabase
      .from("replies")
      .select(`
        *,
        author:users(id, name, email, role, avatar_url)
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data
  },

  async create(reply: Inserts<"replies">) {
    const { data, error } = await supabase
      .from("replies")
      .insert(reply)
      .select(`
        *,
        author:users(id, name, email, role, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Updates<"replies">) {
    const { data, error } = await supabase
      .from("replies")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        author:users(id, name, email, role, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("replies").delete().eq("id", id)

    if (error) throw error
  },
}

// Vote operations
export const voteService = {
  async getByTicketId(ticketId: string) {
    const { data, error } = await supabase.from("votes").select("*").eq("ticket_id", ticketId)

    if (error) throw error
    return data
  },

  async getUserVote(ticketId: string, userId: string) {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("ticket_id", ticketId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async upsert(vote: Inserts<"votes">) {
    const { data, error } = await supabase
      .from("votes")
      .upsert(vote, { onConflict: "ticket_id,user_id" })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(ticketId: string, userId: string) {
    const { error } = await supabase.from("votes").delete().eq("ticket_id", ticketId).eq("user_id", userId)

    if (error) throw error
  },
}

// Stats operations
export const statsService = {
  async getUserStats(userId: string) {
    const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async updateUserStats(userId: string, stats: Updates<"user_stats">) {
    const { data, error } = await supabase
      .from("user_stats")
      .upsert({ user_id: userId, ...stats }, { onConflict: "user_id" })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSystemStats() {
    // Get total counts
    const [{ count: totalUsers }, { count: totalTickets }, { count: openTickets }, { count: resolvedTickets }] =
      await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("tickets").select("*", { count: "exact", head: true }),
        supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved"),
      ])

    return {
      totalUsers: totalUsers || 0,
      totalTickets: totalTickets || 0,
      openTickets: openTickets || 0,
      resolvedTickets: resolvedTickets || 0,
    }
  },
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToTickets(callback: (payload: any) => void) {
    return supabase
      .channel("tickets")
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, callback)
      .subscribe()
  },

  subscribeToReplies(ticketId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`replies:${ticketId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "replies", filter: `ticket_id=eq.${ticketId}` },
        callback,
      )
      .subscribe()
  },

  subscribeToVotes(ticketId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`votes:${ticketId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes", filter: `ticket_id=eq.${ticketId}` },
        callback,
      )
      .subscribe()
  },
}
