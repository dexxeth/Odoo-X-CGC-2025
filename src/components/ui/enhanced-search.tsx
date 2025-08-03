"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { cn, debounce } from "@/lib/utils-enhanced"

interface SearchFilter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface EnhancedSearchProps {
  placeholder?: string
  onSearch: (query: string, filters: Record<string, string>) => void
  filters?: SearchFilter[]
  className?: string
}

export function EnhancedSearch({ placeholder = "Search...", onSearch, filters = [], className }: EnhancedSearchProps) {
  const [query, setQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = debounce((searchQuery: string, searchFilters: Record<string, string>) => {
    onSearch(searchQuery, searchFilters)
  }, 300)

  useEffect(() => {
    debouncedSearch(query, activeFilters)
  }, [query, activeFilters, debouncedSearch])

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }))
  }

  const clearFilter = (key: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setQuery("")
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {filters.length > 0 && (
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null
            const filter = filters.find((f) => f.key === key)
            const option = filter?.options.find((o) => o.value === value)
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {filter?.label}: {option?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(key)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label htmlFor={`filter-select-${filter.key}`} className="text-sm font-medium">{filter.label}</label>
              <select
                id={`filter-select-${filter.key}`}
                value={activeFilters[filter.key] || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
