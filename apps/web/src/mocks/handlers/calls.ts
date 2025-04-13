import { http, HttpResponse, delay } from 'msw'
import { CallRecord, CallStatus } from '@conista/shared-types'

// Sample call data
const calls: CallRecord[] = Array.from({ length: 25 }, (_, i) => ({
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
}))

// Call handlers
export const callHandlers = [
  // Get calls list with pagination and filtering
  http.get('/api/calls', async ({ request }) => {
    await delay(500)

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')?.toLowerCase()

    // Apply filters
    let filteredCalls = [...calls]

    if (status) {
      filteredCalls = filteredCalls.filter(call => call.status === status)
    }

    if (search) {
      filteredCalls = filteredCalls.filter(call => {
        return (
          call.title.toLowerCase().includes(search) ||
          call.agentName.toLowerCase().includes(search) ||
          (call.customerName && call.customerName.toLowerCase().includes(search))
        )
      })
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedCalls = filteredCalls.slice(start, end)

    return HttpResponse.json({
      calls: paginatedCalls,
      total: filteredCalls.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCalls.length / limit),
    })
  }),

  // Get call by ID
  http.get('/api/calls/:id', async ({ params }) => {
    await delay(300)

    const { id } = params
    const call = calls.find(c => c.id === id)

    if (!call) {
      return new HttpResponse(JSON.stringify({ error: 'Call not found' }), { status: 404 })
    }

    return HttpResponse.json({ call })
  }),
]
