"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedSearch } from "@/components/ui/enhanced-search"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { EnhancedHeader } from "@/components/enhanced-header"
import { useDataStore } from "@/lib/data-store"
import { formatRelativeTime, getPriorityColor, getStatusColor } from "@/lib/utils-enhanced"
import { Plus, Ticket, Clock, CheckCircle, MessageSquare, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react"

export default function UserDashboard() {
  const { tickets, currentUser, categories, isLoading, initializeData } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const userTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.customerId === currentUser?.id)
  }, [tickets, currentUser])

  const filteredTickets = useMemo(() => {
    return userTickets.filter((ticket) => {
      const matchesSearch =
        !searchQuery ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !filters.status || ticket.status === filters.status
      const matchesCategory = !filters.category || ticket.category === filters.category
      const matchesPriority = !filters.priority || ticket.priority === filters.priority

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })
  }, [userTickets, searchQuery, filters])

  const stats = useMemo(() => {
    const total = userTickets.length
    const open = userTickets.filter((t) => t.status === "open").length
    const inProgress = userTickets.filter((t) => t.status === "in-progress").length
    const resolved = userTickets.filter((t) => t.status === "resolved").length
    const avgResponseTime =
      userTickets.length > 0
        ? (userTickets.reduce((acc, ticket) => acc + ticket.replies.length, 0) / userTickets.length) * 0.5
        : 0

    return { total, open, inProgress, resolved, avgResponseTime }
  }, [userTickets])

  const searchFilters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: categories.map((cat) => ({ value: cat.name.toLowerCase(), label: cat.name })),
    },
    {
      key: "priority",
      label: "Priority",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" },
      ],
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedHeader userRole="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader userRole="user" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {currentUser?.name || "User"}!</h2>
          <p className="text-gray-600">Here&apos;s an overview of your support tickets and recent activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            description="All time"
            icon={Ticket}
            trend={{ value: 12, label: "vs last month", isPositive: true }}
          />
          <StatsCard
            title="Open Tickets"
            value={stats.open}
            description="Need attention"
            icon={Clock}
            variant={stats.open > 0 ? "warning" : "default"}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            description="This month"
            icon={CheckCircle}
            variant="success"
            trend={{ value: 8, label: "vs last month", isPositive: true }}
          />
          <StatsCard
            title="Avg Response"
            value={`${stats.avgResponseTime.toFixed(1)}h`}
            description="Response time"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">My Tickets</CardTitle>
                    <CardDescription>Manage and track your support requests</CardDescription>
                  </div>
                  <Link href="/user/create-ticket">
                    <Button className="shadow-sm hover:shadow-md transition-shadow">
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedSearch
                  placeholder="Search tickets by subject, ID, or description..."
                  onSearch={(query, filters) => {
                    setSearchQuery(query)
                    setFilters(filters)
                  }}
                  filters={searchFilters}
                  className="mb-6"
                />

                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || Object.keys(filters).length > 0
                        ? "Try adjusting your search or filters"
                        : "Create your first support ticket to get started"}
                    </p>
                    <Link href="/user/create-ticket">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Ticket
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Link
                                href={`/user/ticket/${ticket.id}`}
                                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors group-hover:underline"
                              >
                                {ticket.subject}
                              </Link>
                              <Badge variant="outline" className="text-xs">
                                {ticket.id}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                              <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("-", " ")}</Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                              <span className="text-gray-600">Category: {ticket.category}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Created {formatRelativeTime(ticket.createdAt)}
                              {ticket.updatedAt !== ticket.createdAt && (
                                <span> • Updated {formatRelativeTime(ticket.updatedAt)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {ticket.replies.length}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4 text-green-600" />
                                {ticket.upvotes}
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsDown className="h-4 w-4 text-red-600" />
                                {ticket.downvotes}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/user/create-ticket">
                  <Button className="w-full justify-start shadow-sm hover:shadow-md transition-shadow">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Ticket
                  </Button>
                </Link>
                <Link href="/user/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const categoryTickets = userTickets.filter(
                      (t) => t.category.toLowerCase() === category.name.toLowerCase(),
                    ).length

                    return (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge variant="secondary">{categoryTickets}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTickets
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 3)
                    .map((ticket) => (
                      <div key={ticket.id} className="text-sm">
                        <Link href={`/user/ticket/${ticket.id}`} className="font-medium text-blue-600 hover:underline">
                          {ticket.subject}
                        </Link>
                        <p className="text-gray-600 text-xs">{formatRelativeTime(ticket.updatedAt)}</p>
                      </div>
                    ))}
                  {userTickets.length === 0 && <p className="text-sm text-gray-600">No recent activity</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
