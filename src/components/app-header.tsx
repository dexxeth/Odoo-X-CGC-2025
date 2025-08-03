"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/logout-dialog"
import { useAuthWithDialog } from "@/lib/auth-with-dialog"
import { User, LogOut, Ticket, Shield } from "lucide-react"

interface AppHeaderProps {
  title: string
  userRole?: "user" | "agent" | "admin"
  showBackButton?: boolean
  backHref?: string
  children?: React.ReactNode
}

export function AppHeader({ title, userRole = "user", children }: AppHeaderProps) {
  const { handleLogoutClick, confirmLogout, getCurrentUser, showLogoutDialog, setShowLogoutDialog } =
    useAuthWithDialog()

  const currentUser = getCurrentUser()

  const getIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield className="h-8 w-8 text-red-600" />
      case "agent":
        return <Ticket className="h-8 w-8 text-blue-600" />
      default:
        return <Ticket className="h-8 w-8 text-blue-600" />
    }
  }

  const getTitle = () => {
    switch (userRole) {
      case "admin":
        return "QuickDesk Admin"
      case "agent":
        return "QuickDesk Agent"
      default:
        return "QuickDesk"
    }
  }

  return (
    <>
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <h1 className="text-2xl font-bold">{title || getTitle()}</h1>
          </div>

          {children}

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              {currentUser?.name || "Profile"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogoutClick}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={confirmLogout} />
    </>
  )
}
