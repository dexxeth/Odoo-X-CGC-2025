"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Ticket, Shield, ArrowLeft } from "lucide-react"

interface EnhancedHeaderProps {
  title?: string
  userRole: "user" | "agent" | "admin"
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
}

export function EnhancedHeader({
  title,
  userRole,
  showBackButton = false,
  backHref = "/",
  backLabel = "Back",
  children,
}: EnhancedHeaderProps) {
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

  const getDefaultTitle = () => {
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
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        )}

        <div className="flex items-center space-x-2">
          {getIcon()}
          <h1 className="text-2xl font-bold">{title || getDefaultTitle()}</h1>
        </div>

        {children && <div className="flex-1 flex justify-center">{children}</div>}

        <div className="ml-auto">
          <ProfileDropdown userRole={userRole} />
        </div>
      </div>
    </header>
  )
}
