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
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, User, MapPin, Bell, Key, Camera, Save, LogOut, Ticket, Clock, Star, Award } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function AgentProfilePage() {
  const { logout, getCurrentUser } = useAuth()
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "Sarah Johnson",
    email: currentUser?.email || "sarah.johnson@quickdesk.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    bio: "Experienced support agent with 5+ years in customer service. Specialized in technical issues and user onboarding.",
    department: "Customer Support",
    team: "Technical Support Team",
    employeeId: "QD-2023-001",
    joinDate: "March 2023",
    expertise: ["Technical Issues", "Account Management", "Billing Support"],
  })

  const [notifications, setNotifications] = useState({
    newTicketAssignments: true,
    ticketEscalations: true,
    teamUpdates: true,
    performanceReports: true,
    trainingNotifications: false,
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
        description: "Your profile has been successfully updated.",
      })
    }, 1000)
  }

  const stats = [
    { label: "Tickets Resolved", value: "342", icon: Ticket, color: "text-green-600" },
    { label: "Avg Response Time", value: "2.4h", icon: Clock, color: "text-blue-600" },
    { label: "Customer Rating", value: "4.8", icon: Star, color: "text-yellow-600" },
    { label: "This Month", value: "28", icon: Award, color: "text-purple-600" },
  ]

  const performanceMetrics = [
    { label: "Response Time", value: 85, target: "< 4 hours" },
    { label: "Resolution Rate", value: 92, target: "> 90%" },
    { label: "Customer Satisfaction", value: 96, target: "> 95%" },
    { label: "First Contact Resolution", value: 78, target: "> 75%" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/agent/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Agent Profile</h1>
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
                    <Badge variant="default">Support Agent</Badge>
                    <Badge variant="outline">{profileData.team}</Badge>
                    <Badge variant="secondary">ID: {profileData.employeeId}</Badge>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-2">
                    {profileData.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
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

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Your current performance against team targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metric.label}</span>
                      <span className="text-sm text-gray-600">{metric.target}</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Current: {metric.value}%</span>
                      <span
                        className={
                          metric.value >= 90
                            ? "text-green-600"
                            : metric.value >= 75
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {metric.value >= 90 ? "Excellent" : metric.value >= 75 ? "Good" : "Needs Improvement"}
                      </span>
                    </div>
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

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Work Information
                </CardTitle>
                <CardDescription>Your role and team details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={profileData.department} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <Input id="team" value={profileData.team} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" value={profileData.employeeId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
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
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive work-related notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Ticket Assignments</Label>
                  <p className="text-sm text-gray-600">Get notified when tickets are assigned to you</p>
                </div>
                <Switch
                  checked={notifications.newTicketAssignments}
                  onCheckedChange={(checked) => handleNotificationChange("newTicketAssignments", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ticket Escalations</Label>
                  <p className="text-sm text-gray-600">Receive alerts for escalated tickets</p>
                </div>
                <Switch
                  checked={notifications.ticketEscalations}
                  onCheckedChange={(checked) => handleNotificationChange("ticketEscalations", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Updates</Label>
                  <p className="text-sm text-gray-600">Stay updated with team announcements</p>
                </div>
                <Switch
                  checked={notifications.teamUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("teamUpdates", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Reports</Label>
                  <p className="text-sm text-gray-600">Receive monthly performance summaries</p>
                </div>
                <Switch
                  checked={notifications.performanceReports}
                  onCheckedChange={(checked) => handleNotificationChange("performanceReports", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Training Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about training opportunities</p>
                </div>
                <Switch
                  checked={notifications.trainingNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("trainingNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 2 months ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Enhanced security for agent accounts</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">API Access</h4>
                  <p className="text-sm text-gray-600">Manage API keys and integrations</p>
                </div>
                <Button variant="outline">Manage API</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
