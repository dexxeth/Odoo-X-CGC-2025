import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Users, BarChart3, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              QuickDesk
            </h1>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple Help Desk
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Solution
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your support workflow with QuickDesk. Create tickets, track progress, and resolve issues
            efficiently with our modern, intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuickDesk?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built for modern teams who need efficient, scalable support solutions
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white border-0 shadow-md">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-2xl w-fit">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl mb-2">Easy Ticket Management</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Create, track, and resolve tickets with a simple and intuitive interface designed for efficiency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white border-0 shadow-md">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-2xl w-fit">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl mb-2">Role-Based Access</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Different dashboards and permissions for end users, support agents, and administrators.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white border-0 shadow-md">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-2xl w-fit">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl mb-2">Advanced Analytics</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Search, filter, and analyze tickets by status, category, priority, and performance metrics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using QuickDesk to streamline their support operations.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">QuickDesk</h4>
              </div>
              <p className="text-gray-400">Modern help desk solution for efficient customer support.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Team Astrive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
