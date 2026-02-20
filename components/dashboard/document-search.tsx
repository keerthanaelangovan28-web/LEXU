'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, X } from 'lucide-react'

interface DocumentSearchProps {
  onSearch: (query: string, filters: DocumentFilters) => void
}

interface DocumentFilters {
  status?: string
  type?: string
  dateRange?: string
}

export function DocumentSearch({ onSearch }: DocumentSearchProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DocumentFilters>({})

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setQuery('')
    setFilters({})
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents by name, type, or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 border-slate-600 bg-slate-700 text-white"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-cyan-500 to-blue-600"
        >
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-slate-600"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="border-slate-700 bg-slate-800">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-slate-600 bg-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Document Type</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-slate-600 bg-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="">All Types</option>
                  <option value="contract">Contract</option>
                  <option value="agreement">Agreement</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Date Range</label>
                <select
                  value={filters.dateRange || ''}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full border border-slate-600 bg-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSearch} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-slate-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
