'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SupabaseTest() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        setResult(`Database Error: ${error.message}`)
      } else {
        setResult(`✅ Database connection successful`)
      }
    } catch (error: any) {
      setResult(`❌ Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    try {
      // Test auth endpoint
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      if (error) {
        setResult(`Auth Error: ${error.message}`)
      } else {
        setResult(`✅ Auth endpoint accessible (test signup worked)`)
      }
    } catch (error: any) {
      setResult(`❌ Auth failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading} size="sm">
            Test Database
          </Button>
          <Button onClick={testAuth} disabled={loading} size="sm" variant="outline">
            Test Auth
          </Button>
        </div>
        
        {result && (
          <div className="p-3 bg-gray-50 rounded text-sm font-mono">
            {result}
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </CardContent>
    </Card>
  )
}
