"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Ticket, Clock, AlertCircle, MessageSquare, User, LogOut, Plus, Share } from "lucide-react"
import { useAuth } from "@/lib/auth"

// Mock data for agent dashboard
const mockTickets = [
  {
    id: "T-001",
    subject: "Login Issues",
    category: "Technical",
    status: "Open",
    priority: "High",
    created: "2024-01-15",
    customer: "John Doe",
    lastReply: "2 hours ago",
    assignedTo: "me",
  },
  {
    id: "T-002",
    subject: "Password Reset Request",
    category: "Account",
    status: "In Progress",
    priority: "Medium",
    created: "2024-01-14",
    customer: "Jane Smith",
    lastReply: "1 day ago",
    assignedTo: "me",
  },
  {
    id: "T-003",
    subject: "Feature Request - Dark Mode",
    category: "Feature",
    status: "Open",
    priority: "Low",
    created: "2024-01-10",
    customer: "Mike Johnson",
    lastReply: "3 days ago",
    assignedTo: "unassigned",
  },
  {
    id: "T-004",
    subject: "Billing Question",
    category: "Billing",
    status: "Open",
    priority: "Medium",
    created: "2024-01-12",
    customer: "Sarah Wilson",
    lastReply: "5 hours ago",
    assignedTo: "unassigned",
  },
]

export default function AgentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("my-tickets")

  const { logout, getCurrentUser } = useAuth()
  const currentUser = getCurrentUser()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-orange-100 text-orange-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const myTickets = mockTickets.filter((ticket) => ticket.assignedTo === "me")
  const allTickets = mockTickets
  const unassignedTickets = mockTickets.filter((ticket) => ticket.assignedTo === "unassigned")

  const filteredTickets = (tickets: typeof mockTickets) => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">QuickDesk Agent</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/agent/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {currentUser?.name || "Profile"}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTickets.length}</div>
              <p className="text-xs text-muted-foreground">Assigned to me</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTickets.filter((t) => t.status === "Open").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTickets.filter((t) => t.status === "In Progress").length}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <MessageSquare className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unassignedTickets.length}</div>
              <p className="text-xs text-muted-foreground">Need assignment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage and respond to customer support requests</CardDescription>
              </div>
              <Link href="/agent/create-ticket">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="my-tickets">My Tickets ({myTickets.length})</TabsTrigger>
                <TabsTrigger value="all-tickets">All Tickets ({allTickets.length})</TabsTrigger>
                <TabsTrigger value="unassigned">Unassigned ({unassignedTickets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="my-tickets" className="mt-6">
                <div className="space-y-4">
                  {filteredTickets(myTickets).map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/agent/ticket/${ticket.id}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              {ticket.subject}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {ticket.id}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            <span>Category: {ticket.category}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Customer: {ticket.customer} • Created: {ticket.created} • Last reply: {ticket.lastReply}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm">Reply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all-tickets" className="mt-6">
                <div className="space-y-4">
                  {filteredTickets(allTickets).map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/agent/ticket/${ticket.id}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              {ticket.subject}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {ticket.id}
                            </Badge>
                            {ticket.assignedTo === "unassigned" && (
                              <Badge variant="destructive" className="text-xs">
                                Unassigned
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            <span>Category: {ticket.category}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Customer: {ticket.customer} • Created: {ticket.created} • Last reply: {ticket.lastReply}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.assignedTo === "unassigned" && (
                            <Button size="sm" variant="outline">
                              Assign to Me
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm">Reply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="unassigned" className="mt-6">
                <div className="space-y-4">
                  {filteredTickets(unassignedTickets).map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/agent/ticket/${ticket.id}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              {ticket.subject}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {ticket.id}
                            </Badge>
                            <Badge variant="destructive" className="text-xs">
                              Needs Assignment
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            <span>Category: {ticket.category}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Customer: {ticket.customer} • Created: {ticket.created} • Last reply: {ticket.lastReply}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            Assign to Me
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
