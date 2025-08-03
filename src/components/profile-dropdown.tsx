"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutDialog } from "@/components/logout-dialog"
import { useAuthWithDialog } from "@/lib/auth-with-dialog"
import { User, Settings, LogOut, Bell, HelpCircle } from "lucide-react"

interface ProfileDropdownProps {
  userRole: "user" | "agent" | "admin"
}

export function ProfileDropdown({ userRole }: ProfileDropdownProps) {
  const { handleLogoutClick, confirmLogout, getCurrentUser, showLogoutDialog, setShowLogoutDialog } =
    useAuthWithDialog()
  const currentUser = getCurrentUser()

  const getProfilePath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/profile"
      case "agent":
        return "/agent/profile"
      default:
        return "/user/profile"
    }
  }

  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/dashboard"
      case "agent":
        return "/agent/dashboard"
      default:
        return "/user/dashboard"
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {currentUser?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser?.email || "user@example.com"}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={getDashboardPath()}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href={getProfilePath()}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogoutClick}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={confirmLogout} />
    </>
  )
}
