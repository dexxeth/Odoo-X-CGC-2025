"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Key,
  Camera,
  Save,
  LogOut,
  Users,
  Settings,
  Database,
  Activity,
  Crown,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function AdminProfilePage() {
  const { logout, getCurrentUser } = useAuth()
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "Michael Chen",
    email: currentUser?.email || "michael.chen@quickdesk.com",
    phone: "+1 (555) 123-0000",
    location: "Seattle, WA",
    bio: "System Administrator with 10+ years of experience in IT management and customer support systems. Passionate about creating efficient workflows and maintaining high system reliability.",
    department: "IT Administration",
    role: "System Administrator",
    employeeId: "QD-ADMIN-001",
    joinDate: "January 2022",
    permissions: ["User Management", "System Configuration", "Data Analytics", "Security Management"],
  })

  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    securityNotifications: true,
    userRegistrations: true,
    performanceReports: true,
    backupNotifications: true,
    maintenanceAlerts: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your admin profile has been successfully updated.",
      })
    }, 1000)
  }

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "text-blue-600" },
    { label: "Active Agents", value: "24", icon: Shield, color: "text-green-600" },
    { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-purple-600" },
    { label: "Admin Since", value: "2022", icon: Crown, color: "text-yellow-600" },
  ]

  const systemHealth = [
    { component: "Database", status: "Healthy", uptime: "99.9%" },
    { component: "Email Service", status: "Operational", uptime: "99.8%" },
    { component: "File Storage", status: "Healthy", uptime: "100%" },
    { component: "API Gateway", status: "Operational", uptime: "99.7%" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">Admin Profile</h1>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {profileData.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    <Badge variant="destructive">System Administrator</Badge>
                    <Badge variant="outline">{profileData.department}</Badge>
                    <Badge variant="secondary">ID: {profileData.employeeId}</Badge>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-2">
                    {profileData.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Health Overview
              </CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemHealth.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.component}</h4>
                      <p className="text-sm text-gray-600">Uptime: {item.uptime}</p>
                    </div>
                    <Badge
                      variant={item.status === "Healthy" ? "default" : "secondary"}
                      className={
                        item.status === "Healthy" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Administrative Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Administrative Information
                </CardTitle>
                <CardDescription>Your administrative role and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={profileData.department} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profileData.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" value={profileData.employeeId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Admin Since</Label>
                  <Input id="joinDate" value={profileData.joinDate} disabled />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Admin Notification Preferences
              </CardTitle>
              <CardDescription>Configure system and administrative notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-gray-600">Critical system issues and downtime alerts</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("systemAlerts", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Notifications</Label>
                  <p className="text-sm text-gray-600">Security breaches and suspicious activities</p>
                </div>
                <Switch
                  checked={notifications.securityNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("securityNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registrations</Label>
                  <p className="text-sm text-gray-600">New user registrations and role changes</p>
                </div>
                <Switch
                  checked={notifications.userRegistrations}
                  onCheckedChange={(checked) => handleNotificationChange("userRegistrations", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Reports</Label>
                  <p className="text-sm text-gray-600">Weekly system performance summaries</p>
                </div>
                <Switch
                  checked={notifications.performanceReports}
                  onCheckedChange={(checked) => handleNotificationChange("performanceReports", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Notifications</Label>
                  <p className="text-sm text-gray-600">Database backup status and failures</p>
                </div>
                <Switch
                  checked={notifications.backupNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("backupNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Alerts</Label>
                  <p className="text-sm text-gray-600">Scheduled maintenance and updates</p>
                </div>
                <Switch
                  checked={notifications.maintenanceAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("maintenanceAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Advanced Security Settings
              </CardTitle>
              <CardDescription>Administrative security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Admin Password</h4>
                  <p className="text-sm text-gray-600">Last changed 1 month ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Required for admin accounts</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Admin API Keys</h4>
                  <p className="text-sm text-gray-600">Manage system API access</p>
                </div>
                <Button variant="outline">Manage Keys</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Audit Logs</h4>
                  <p className="text-sm text-gray-600">View administrative actions</p>
                </div>
                <Button variant="outline">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
