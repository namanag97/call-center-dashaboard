import { http, HttpResponse, delay } from 'msw'
import { 
  CallRecord, 
  CallStatus, 
  CallListResponse, 
  PaginationState, 
  SortOptions, 
  FilterOptions,
  CallStatistics,
  ApiErrorResponse
} from '@conista/shared-types'

// Sample call data
const calls: CallRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: `call-${i + 1}`,
  title: `Call with Customer ${i + 1}`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
  duration: Math.floor(Math.random() * 1800) + 120, // 2-30 minutes
  agentId: Math.random() > 0.5 ? '2' : '3',
  agentName: Math.random() > 0.5 ? 'Sarah Manager' : 'Mike Agent',
  customerId: `cust-${i + 100}`,
  customerName: `Customer ${i + 100}`,
  categories: [
    Math.random() > 0.5 ? 'Support' : 'Sales',
    Math.random() > 0.7 ? 'Complaint' : '',
    Math.random() > 0.8 ? 'Escalation' : '',
  ].filter(Boolean),
  status: Object.values(CallStatus)[Math.floor(Math.random() * Object.values(CallStatus).length)],
  tags: [
    Math.random() > 0.5 ? 'Important' : '',
    Math.random() > 0.7 ? 'Follow-up' : '',
    Math.random() > 0.8 ? 'Pending' : '',
  ].filter(Boolean),
  score: Math.floor(Math.random() * 100),
  sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
  complianceIssues: Math.random() > 0.8,
  lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // within last week
}))

/**
 * Parses search params into structured filter options
 */
const parseFilterOptions = (url: URL): FilterOptions => {
  const filters: FilterOptions = {}
  
  // Search text
  const search = url.searchParams.get('search')
  if (search) {
    filters.search = search
  }
  
  // Status filter
  const status = url.searchParams.getAll('status')
  if (status.length > 0) {
    filters.status = status as CallStatus[]
  }
  
  // Date range
  const startDate = url.searchParams.get('startDate')
  const endDate = url.searchParams.get('endDate')
  if (startDate || endDate) {
    filters.dateRange = {
      ...(startDate && { start: startDate }),
      ...(endDate && { end: endDate })
    }
  }
  
  // Agent IDs
  const agentIds = url.searchParams.getAll('agentId')
  if (agentIds.length > 0) {
    filters.agentIds = agentIds
  }
  
  // Categories
  const categories = url.searchParams.getAll('category')
  if (categories.length > 0) {
    filters.categories = categories
  }
  
  // Tags
  const tags = url.searchParams.getAll('tag')
  if (tags.length > 0) {
    filters.tags = tags
  }
  
  // Sentiment
  const sentiments = url.searchParams.getAll('sentiment')
  if (sentiments.length > 0) {
    filters.sentiment = sentiments as ('positive' | 'neutral' | 'negative')[]
  }
  
  // Duration range
  const minDuration = url.searchParams.get('minDuration')
  const maxDuration = url.searchParams.get('maxDuration')
  if (minDuration || maxDuration) {
    filters.duration = {
      ...(minDuration && { min: parseInt(minDuration, 10) }),
      ...(maxDuration && { max: parseInt(maxDuration, 10) })
    }
  }
  
  // Score range
  const minScore = url.searchParams.get('minScore')
  const maxScore = url.searchParams.get('maxScore')
  if (minScore || maxScore) {
    filters.score = {
      ...(minScore && { min: parseInt(minScore, 10) }),
      ...(maxScore && { max: parseInt(maxScore, 10) })
    }
  }
  
  // Compliance issues
  const complianceIssues = url.searchParams.get('complianceIssues')
  if (complianceIssues === 'true') {
    filters.complianceIssues = true
  }
  
  return filters
}

/**
 * Parses search params into sort options
 */
const parseSortOptions = (url: URL): SortOptions | undefined => {
  const sortField = url.searchParams.get('sortField')
  const sortDirection = url.searchParams.get('sortDirection')
  
  if (sortField && (sortDirection === 'asc' || sortDirection === 'desc')) {
    return {
      field: sortField,
      direction: sortDirection
    }
  }
  
  return undefined
}

/**
 * Apply filters to calls
 */
const applyFilters = (calls: CallRecord[], filters: FilterOptions): CallRecord[] => {
  let filteredCalls = [...calls]
  
  // Search text (across multiple fields)
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filteredCalls = filteredCalls.filter(call => {
      return (
        call.title.toLowerCase().includes(search) ||
        call.agentName.toLowerCase().includes(search) ||
        (call.customerName && call.customerName.toLowerCase().includes(search)) ||
        call.tags.some(tag => tag.toLowerCase().includes(search)) ||
        call.categories.some(category => category.toLowerCase().includes(search))
      )
    })
  }
  
  // Status filter
  if (filters.status && filters.status.length > 0) {
    filteredCalls = filteredCalls.filter(call => filters.status!.includes(call.status))
  }
  
  // Date range
  if (filters.dateRange) {
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start).getTime()
      filteredCalls = filteredCalls.filter(call => new Date(call.date).getTime() >= startDate)
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end).getTime()
      filteredCalls = filteredCalls.filter(call => new Date(call.date).getTime() <= endDate)
    }
  }
  
  // Agent IDs
  if (filters.agentIds && filters.agentIds.length > 0) {
    filteredCalls = filteredCalls.filter(call => filters.agentIds!.includes(call.agentId))
  }
  
  // Categories
  if (filters.categories && filters.categories.length > 0) {
    filteredCalls = filteredCalls.filter(call => 
      call.categories.some(category => filters.categories!.includes(category))
    )
  }
  
  // Tags
  if (filters.tags && filters.tags.length > 0) {
    filteredCalls = filteredCalls.filter(call => 
      call.tags.some(tag => filters.tags!.includes(tag))
    )
  }
  
  // Sentiment
  if (filters.sentiment && filters.sentiment.length > 0) {
    filteredCalls = filteredCalls.filter(call => 
      call.sentiment && filters.sentiment!.includes(call.sentiment)
    )
  }
  
  // Duration range
  if (filters.duration) {
    if (filters.duration.min !== undefined) {
      filteredCalls = filteredCalls.filter(call => call.duration >= filters.duration!.min!)
    }
    if (filters.duration.max !== undefined) {
      filteredCalls = filteredCalls.filter(call => call.duration <= filters.duration!.max!)
    }
  }
  
  // Score range
  if (filters.score) {
    if (filters.score.min !== undefined) {
      filteredCalls = filteredCalls.filter(call => 
        call.score !== undefined && call.score >= filters.score!.min!
      )
    }
    if (filters.score.max !== undefined) {
      filteredCalls = filteredCalls.filter(call => 
        call.score !== undefined && call.score <= filters.score!.max!
      )
    }
  }
  
  // Compliance issues
  if (filters.complianceIssues) {
    filteredCalls = filteredCalls.filter(call => call.complianceIssues === true)
  }
  
  return filteredCalls
}

/**
 * Apply sorting to calls
 */
const applySorting = (calls: CallRecord[], sort?: SortOptions): CallRecord[] => {
  if (!sort) {
    return calls
  }
  
  return [...calls].sort((a, b) => {
    const aValue = a[sort.field as keyof CallRecord]
    const bValue = b[sort.field as keyof CallRecord]
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return sort.direction === 'asc' ? -1 : 1
    if (bValue === undefined) return sort.direction === 'asc' ? 1 : -1
    
    // Compare values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    // Date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      return sort.direction === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime()
    }
    
    // If we get here, we can't compare, so just return 0
    return 0
  })
}

// Calls API handlers
export const callsHandlers = [
  // Get calls list with filtering, sorting, and pagination
  http.get('/api/calls', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    
    try {
      // Parse query parameters
      const filters = parseFilterOptions(url);
      const sort = parseSortOptions(url);
      
      // Parse pagination params
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      
      // Apply filters and sorting
      let filteredCalls = applyFilters(calls, filters);
      filteredCalls = applySorting(filteredCalls, sort);
      
      // Calculate total items and pages
      const totalItems = filteredCalls.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCalls = filteredCalls.slice(start, end);
      
      // Build response
      const response: CallListResponse = {
        data: paginatedCalls,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages
        }
      };
      
      // Add metadata to the response (though not part of the type)
      const responseWithMeta = {
        ...response,
        meta: {
          filters,
          sort: sort || { field: 'date', direction: 'desc' }
        }
      };
      
      // Simulate occasional server errors (helpful for testing error handling)
      if (Math.random() < 0.05) { // 5% chance of error
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'SERVER_ERROR',
            message: 'A server error occurred while processing your request' 
          } 
        }), { status: 500 });
      }
      
      return HttpResponse.json(responseWithMeta);
      
    } catch (error) {
      console.error('Error in calls mock handler:', error);
      
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while processing your request'
        }
      };
      
      return new HttpResponse(JSON.stringify(errorResponse), { status: 500 });
    }
  }),

  // Get call statistics
  http.get('/api/calls/statistics', async ({ request }) => {
    await delay(Math.floor(Math.random() * 300) + 200) // 200-500ms delay
    
    try {
      const url = new URL(request.url)
      const filters = parseFilterOptions(url)
      const filteredCalls = applyFilters(calls, filters)
      
      // Calculate statistics
      const totalCalls = filteredCalls.length
      
      // Count by status
      const byStatus = Object.values(CallStatus).reduce((acc, status) => {
        acc[status] = filteredCalls.filter(call => call.status === status).length
        return acc
      }, {} as Record<CallStatus, number>)
      
      // Calculate average duration
      const totalDuration = filteredCalls.reduce((sum, call) => sum + call.duration, 0)
      const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0
      
      // Calculate average score
      const validScores = filteredCalls.filter(call => call.score !== undefined)
      const totalScore = validScores.reduce((sum, call) => sum + (call.score || 0), 0)
      const averageScore = validScores.length > 0 ? totalScore / validScores.length : undefined
      
      // Count by sentiment
      const bySentiment = filteredCalls.reduce((acc, call) => {
        if (call.sentiment) {
          acc[call.sentiment] = (acc[call.sentiment] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)
      
      // Count compliance issues
      const complianceIssuesCount = filteredCalls.filter(call => call.complianceIssues).length
      
      const statistics: CallStatistics = {
        total: totalCalls,
        byStatus,
        averageDuration,
        averageScore,
        bySentiment,
        complianceIssuesCount,
      }
      
      return HttpResponse.json(statistics)
    } catch (error) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request.',
          details: { error: String(error) }
        }
      }
      return new HttpResponse(JSON.stringify(errorResponse), { status: 500 })
    }
  }),

  // Get call by ID
  http.get('/api/calls/:id', async ({ params }) => {
    await delay(Math.floor(Math.random() * 300) + 200) // 200-500ms delay

    try {
      const { id } = params
      const call = calls.find(c => c.id === id)

      if (!call) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'The requested call could not be found.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      return HttpResponse.json({ data: call })
    } catch (error) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request.',
          details: { error: String(error) }
        }
      }
      return new HttpResponse(JSON.stringify(errorResponse), { status: 500 })
    }
  }),

  // Get available tags
  http.get('/api/calls/tags', async () => {
    await delay(Math.floor(Math.random() * 200) + 100) // 100-300ms delay
    
    const allTags = calls.flatMap(call => call.tags)
    const uniqueTags = [...new Set(allTags)].sort()
    
    return HttpResponse.json({ data: uniqueTags })
  }),

  // Get available categories
  http.get('/api/calls/categories', async () => {
    await delay(Math.floor(Math.random() * 200) + 100) // 100-300ms delay
    
    const allCategories = calls.flatMap(call => call.categories)
    const uniqueCategories = [...new Set(allCategories)].sort()
    
    return HttpResponse.json({ data: uniqueCategories })
  }),
]
