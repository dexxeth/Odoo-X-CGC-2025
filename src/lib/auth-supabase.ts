"use client"

import React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"
import { userService } from "./database"
import type { User } from "@supabase/supabase-js"
import type { Tables } from "./supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Helper function to provide user-friendly error messages
function getAuthErrorMessage(errorMessage: string): string {
  if (errorMessage.includes("Invalid login credentials")) {
    return "Invalid email or password. Please check your credentials and try again."
  }
  if (errorMessage.includes("Email not confirmed")) {
    return "Please check your email and click the confirmation link before signing in."
  }
  if (errorMessage.includes("Too many requests")) {
    return "Too many login attempts. Please wait a few minutes before trying again."
  }
  if (errorMessage.includes("Network error")) {
    return "Network error. Please check your internet connection and try again."
  }
  return errorMessage || "An unexpected error occurred. Please try again."
}

interface AuthContextType {
  user: User | null
  profile: Tables<"users"> | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Tables<"users"> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await userService.getById(userId)
      setProfile(profileData)
    } catch (error: any) {
      // If profile doesn't exist, create one
      if (error.code === "PGRST116") {
        try {
          const newProfile = await userService.create({
            id: userId,
            email: user?.email || "",
            name: user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
            role: "user",
          })
          setProfile(newProfile)
        } catch (createError) {
          console.error("Error creating profile:", createError)
        }
      } else {
        console.error("Error loading profile:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log("Attempting Supabase sign in...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Supabase response:", { data, error })

      if (error) {
        console.error("Supabase auth error:", error)
        throw new Error(getAuthErrorMessage(error.message))
      }

      if (data.user) {
        console.log("User signed in successfully:", data.user.id)
        await userService.updateLastLogin(data.user.id)

        // Redirect based on role
        const userProfile = await userService.getById(data.user.id)
        const redirectPath =
          userProfile.role === "admin"
            ? "/admin/dashboard"
            : userProfile.role === "agent"
              ? "/agent/dashboard"
              : "/user/dashboard"

        router.push(redirectPath)

        toast({
          title: "Welcome back!",
          description: `Signed in successfully as ${userProfile.role}`,
        })
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await userService.create({
          id: data.user.id,
          email,
          name: userData.name,
          role: userData.role || "user",
          company: userData.company,
          department: userData.department,
        })

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setProfile(null)
      router.push("/")

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error("No user logged in")

    try {
      const updatedProfile = await userService.update(user.id, updates)
      setProfile(updatedProfile)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadProfile(user.id)
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
