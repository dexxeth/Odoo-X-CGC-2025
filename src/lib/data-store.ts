"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Ticket {
  id: string
  subject: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  customerId: string
  customerName: string
  customerEmail: string
  assignedTo?: string
  assignedToName?: string
  replies: Reply[]
  attachments: string[]
  upvotes: number
  downvotes: number
  tags: string[]
}

export interface Reply {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  authorRole: "user" | "agent" | "admin"
  message: string
  createdAt: string
  attachments: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "agent" | "admin"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
  avatar?: string
  phone?: string
  location?: string
  bio?: string
  company?: string
  department?: string
  permissions?: string[]
  stats?: {
    ticketsCreated?: number
    ticketsResolved?: number
    avgResponseTime?: number
    customerRating?: number
  }
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  ticketCount: number
  isActive: boolean
}

interface DataStore {
  // State
  tickets: Ticket[]
  users: User[]
  categories: Category[]
  currentUser: User | null
  isLoading: boolean

  // Tickets
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "replies" | "upvotes" | "downvotes">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  addReply: (ticketId: string, reply: Omit<Reply, "id" | "createdAt">) => void
  voteTicket: (ticketId: string, type: "up" | "down", userId: string) => void

  // Users
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  setCurrentUser: (user: User | null) => void

  // Categories
  addCategory: (category: Omit<Category, "id" | "ticketCount">) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Utility
  setLoading: (loading: boolean) => void
  initializeData: () => void
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tickets: [],
      users: [],
      categories: [],
      currentUser: null,
      isLoading: false,

      // Ticket actions
      addTicket: (ticketData) => {
        const newTicket: Ticket = {
          ...ticketData,
          id: `T-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
          upvotes: 0,
          downvotes: 0,
        }
        set((state) => ({ tickets: [...state.tickets, newTicket] }))
      },

      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
          ),
        }))
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        }))
      },

      addReply: (ticketId, replyData) => {
        const newReply: Reply = {
          ...replyData,
          id: `R-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  replies: [...ticket.replies, newReply],
                  updatedAt: new Date().toISOString(),
                }
              : ticket,
          ),
        }))
      },

      voteTicket: (ticketId, type, userId) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  upvotes: type === "up" ? ticket.upvotes + 1 : ticket.upvotes,
                  downvotes: type === "down" ? ticket.downvotes + 1 : ticket.downvotes,
                }
              : ticket,
          ),
        }))
      },

      // User actions
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `U-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, newUser] }))
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
        }))

        // Update current user if it's the same
        const { currentUser } = get()
        if (currentUser?.id === id) {
          set({ currentUser: { ...currentUser, ...updates } })
        }
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }))
      },

      setCurrentUser: (user) => {
        set({ currentUser: user })
      },

      // Category actions
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: `C-${Date.now()}`,
          ticketCount: 0,
        }
        set((state) => ({ categories: [...state.categories, newCategory] }))
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
        }))
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }))
      },

      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      initializeData: () => {
        const { categories, users } = get()

        if (categories.length === 0) {
          const defaultCategories: Category[] = [
            {
              id: "C-1",
              name: "Technical",
              description: "Technical issues and bugs",
              color: "blue",
              ticketCount: 0,
              isActive: true,
            },
            {
              id: "C-2",
              name: "Account",
              description: "Account and login related",
              color: "green",
              ticketCount: 0,
              isActive: true,
            },
            {
              id: "C-3",
              name: "Billing",
              description: "Billing and payment issues",
              color: "orange",
              ticketCount: 0,
              isActive: true,
            },
            {
              id: "C-4",
              name: "Feature",
              description: "Feature requests",
              color: "purple",
              ticketCount: 0,
              isActive: true,
            },
          ]
          set({ categories: defaultCategories })
        }

        if (users.length === 0) {
          const defaultUsers: User[] = [
            {
              id: "U-1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
              status: "active",
              createdAt: new Date().toISOString(),
              company: "Tech Corp",
              department: "Engineering",
            },
            {
              id: "U-2",
              name: "Sarah Johnson",
              email: "sarah@quickdesk.com",
              role: "agent",
              status: "active",
              createdAt: new Date().toISOString(),
              department: "Customer Support",
              stats: {
                ticketsResolved: 342,
                avgResponseTime: 2.4,
                customerRating: 4.8,
              },
            },
            {
              id: "U-3",
              name: "Michael Chen",
              email: "michael@quickdesk.com",
              role: "admin",
              status: "active",
              createdAt: new Date().toISOString(),
              department: "IT Administration",
              permissions: ["user-management", "system-config", "analytics", "security"],
            },
          ]
          set({ users: defaultUsers })
        }
      },
    }),
    {
      name: "quickdesk-storage",
      skipHydration: true,
    },
  ),
)
