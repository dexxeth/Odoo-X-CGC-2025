"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useAuthWithDialog() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const logout = () => {
    // Clear any stored authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      sessionStorage.clear()
    }

    // Show logout success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })

    // Redirect to home page
    router.push("/")
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    setShowLogoutDialog(false)
    logout()
  }

  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  }

  const getUserRole = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || "user"
    }
    return "user"
  }

  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  }

  return {
    logout,
    handleLogoutClick,
    confirmLogout,
    getCurrentUser,
    getUserRole,
    isAuthenticated,
    showLogoutDialog,
    setShowLogoutDialog,
  }
}
