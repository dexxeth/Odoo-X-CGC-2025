"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  Paperclip,
  Clock,
  User,
  MessageSquare,
  Ticket,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

// Mock ticket data
const mockTicket = {
  id: "T-001",
  subject: "Login Issues - Unable to access dashboard",
  description:
    "I'm experiencing issues logging into my account. After entering my credentials, the page just refreshes without any error message. I've tried clearing my browser cache and using different browsers, but the issue persists.",
  category: "Technical",
  status: "In Progress",
  priority: "High",
  created: "2024-01-15T10:30:00Z",
  updated: "2024-01-16T14:20:00Z",
  assignedTo: "Sarah Johnson",
  upvotes: 5,
  downvotes: 1,
  userVote: null, // null, 'up', or 'down'
}

const mockConversation = [
  {
    id: 1,
    author: "John Doe",
    role: "user",
    message:
      "I'm experiencing issues logging into my account. After entering my credentials, the page just refreshes without any error message. I've tried clearing my browser cache and using different browsers, but the issue persists.",
    timestamp: "2024-01-15T10:30:00Z",
    attachments: ["screenshot.png"],
  },
  {
    id: 2,
    author: "Sarah Johnson",
    role: "agent",
    message:
      "Hi John, thank you for reporting this issue. I can see that you're having trouble with the login process. Let me investigate this for you. Can you please try the following steps:\n\n1. Clear your browser cookies specifically for our domain\n2. Try logging in using an incognito/private browsing window\n3. Let me know what browser and version you're using\n\nI'll also check our server logs for any authentication errors on your account.",
    timestamp: "2024-01-15T11:45:00Z",
    attachments: [],
  },
  {
    id: 3,
    author: "John Doe",
    role: "user",
    message:
      "Hi Sarah, I tried the steps you mentioned:\n\n1. ✅ Cleared cookies - still having the issue\n2. ✅ Tried incognito mode - same problem\n3. I'm using Chrome Version 120.0.6099.109\n\nThe issue persists across all attempts. Is there anything else I can try?",
    timestamp: "2024-01-15T14:20:00Z",
    attachments: [],
  },
  {
    id: 4,
    author: "Sarah Johnson",
    role: "agent",
    message:
      "Thanks for trying those steps, John. I've found the issue in our server logs - there was a problem with the authentication service that affected a small number of users. Our development team has deployed a fix.\n\nCan you please try logging in again now? The issue should be resolved. If you still experience problems, please let me know immediately.",
    timestamp: "2024-01-16T09:15:00Z",
    attachments: [],
  },
]

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [newMessage, setNewMessage] = useState("")
  const [userVote, setUserVote] = useState<"up" | "down" | null>(mockTicket.userVote)
  const [upvotes, setUpvotes] = useState(mockTicket.upvotes)
  const [downvotes, setDownvotes] = useState(mockTicket.downvotes)
  const { toast } = useToast()
  const { logout: authLogout } = useAuth()

  const handleVote = (voteType: "up" | "down") => {
    if (userVote === voteType) {
      // Remove vote
      setUserVote(null)
      if (voteType === "up") {
        setUpvotes((prev) => prev - 1)
      } else {
        setDownvotes((prev) => prev - 1)
      }
    } else {
      // Add or change vote
      if (userVote === "up" && voteType === "down") {
        setUpvotes((prev) => prev - 1)
        setDownvotes((prev) => prev + 1)
      } else if (userVote === "down" && voteType === "up") {
        setDownvotes((prev) => prev - 1)
        setUpvotes((prev) => prev + 1)
      } else if (userVote === null) {
        if (voteType === "up") {
          setUpvotes((prev) => prev + 1)
        } else {
          setDownvotes((prev) => prev + 1)
        }
      }
      setUserVote(voteType)
    }

    toast({
      title: "Vote recorded",
      description: `Your ${voteType}vote has been recorded.`,
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Here you would typically send the message to your backend
    toast({
      title: "Message sent",
      description: "Your reply has been added to the ticket.",
    })
    setNewMessage("")
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/user/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Ticket Details</h1>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" size="sm" onClick={authLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Ticket Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{mockTicket.subject}</CardTitle>
                    <Badge variant="outline">{mockTicket.id}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className={getStatusColor(mockTicket.status)}>{mockTicket.status}</Badge>
                    <Badge className={getPriorityColor(mockTicket.priority)}>{mockTicket.priority}</Badge>
                    <span className="text-sm text-gray-600">Category: {mockTicket.category}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created: {formatDate(mockTicket.created)}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assigned to: {mockTicket.assignedTo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={userVote === "up" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote("up")}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {upvotes}
                    </Button>
                    <Button
                      variant={userVote === "down" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVote("down")}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {downvotes}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Conversation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation
              </CardTitle>
              <CardDescription>Timeline of all messages and updates for this ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockConversation.map((message, index) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>
                        {message.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{message.author}</span>
                        <Badge variant={message.role === "agent" ? "default" : "secondary"} className="text-xs">
                          {message.role === "agent" ? "Support Agent" : "User"}
                        </Badge>
                        <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-2">
                        <p className="whitespace-pre-wrap">{message.message}</p>
                      </div>
                      {message.attachments.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Paperclip className="h-4 w-4" />
                          {message.attachments.map((attachment, i) => (
                            <span key={i} className="text-blue-600 hover:underline cursor-pointer">
                              {attachment}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Reply Section */}
              <div className="space-y-4">
                <h4 className="font-semibold">Add a Reply</h4>
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
