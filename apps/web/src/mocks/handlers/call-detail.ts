import { http, HttpResponse, delay } from 'msw'
import { 
  CallDetail, 
  TranscriptEntry, 
  AnalysisResult, 
  QAData, 
  SpeakerRole, 
  User,
  UserRole,
  ApiErrorResponse,
  CallStatus
} from '@conista/shared-types'

// Sample transcripts map (call ID -> transcript entries)
const transcripts: Record<string, TranscriptEntry[]> = {
  'call-1': generateSampleTranscript('call-1'),
  'call-2': generateSampleTranscript('call-2'),
  'call-3': generateSampleTranscript('call-3'),
  'call-4': generateSampleTranscript('call-4'),
  'call-5': generateSampleTranscript('call-5'),
}

// Sample analysis results map (call ID -> analysis)
const analysisResults: Record<string, AnalysisResult> = {
  'call-1': generateSampleAnalysis('call-1'),
  'call-2': generateSampleAnalysis('call-2'),
  'call-3': generateSampleAnalysis('call-3'),
  'call-4': generateSampleAnalysis('call-4'),
  'call-5': generateSampleAnalysis('call-5'),
}

// Sample QA data map (call ID -> QA data)
const qaData: Record<string, QAData> = {
  'call-1': generateSampleQAData('call-1'),
  'call-2': generateSampleQAData('call-2'),
  'call-3': generateSampleQAData('call-3'),
  'call-4': generateSampleQAData('call-4'),
  'call-5': generateSampleQAData('call-5'),
}

// Sample call detail map (call ID -> call detail)
const callDetails: Record<string, CallDetail> = {
  'call-1': generateSampleCallDetail('call-1'),
  'call-2': generateSampleCallDetail('call-2'),
  'call-3': generateSampleCallDetail('call-3'),
  'call-4': generateSampleCallDetail('call-4'),
  'call-5': generateSampleCallDetail('call-5'),
}

/**
 * Helper function to generate sample transcript for a call
 */
function generateSampleTranscript(callId: string): TranscriptEntry[] {
  // Create a random number of entries (10-20)
  const entryCount = Math.floor(Math.random() * 11) + 10
  
  let currentTime = 0
  const entries: TranscriptEntry[] = []
  
  for (let i = 0; i < entryCount; i++) {
    const isAgent = i % 2 === 0 // Alternate between agent and customer
    const speakerRole = isAgent ? SpeakerRole.Agent : SpeakerRole.Customer
    const speakerId = isAgent ? 'agent-1' : 'customer-1'
    const speakerName = isAgent ? 'Sarah Manager' : 'John Customer'
    
    // Generate random duration between 3-15 seconds
    const duration = Math.floor(Math.random() * 13) + 3
    const startTime = currentTime
    const endTime = startTime + duration
    
    // Generate some sample text
    let text = ''
    if (i === 0 && isAgent) {
      text = "Hello, thank you for calling. How can I help you today?"
    } else if (i === 1 && !isAgent) {
      text = "Hi, I'm calling about my recent order. I haven't received a shipping confirmation yet."
    } else {
      // Generate random text based on speaker
      const agentPhrases = [
        "I understand your concern.",
        "Let me check that for you.",
        "I see the issue in our system.",
        "I'll make a note of that.",
        "Is there anything else I can help you with?",
        "Thank you for your patience.",
        "I apologize for the inconvenience."
      ]
      
      const customerPhrases = [
        "I'm not satisfied with the response.",
        "When will this be resolved?",
        "I've been waiting for a while now.",
        "Thank you for your help.",
        "Can you explain that again?",
        "I'm still confused about the process.",
        "That makes sense, thank you."
      ]
      
      // Choose 1-3 phrases
      const phraseCount = Math.floor(Math.random() * 3) + 1
      const phrases = isAgent ? agentPhrases : customerPhrases
      
      for (let j = 0; j < phraseCount; j++) {
        const randomIndex = Math.floor(Math.random() * phrases.length)
        text += phrases[randomIndex] + " "
      }
      
      text = text.trim()
    }
    
    // Create individual words with timing
    const words = text.split(' ').map((word, index, arr) => {
      const wordDuration = duration / arr.length
      const wordStartTime = startTime + (index * wordDuration)
      const wordEndTime = wordStartTime + wordDuration
      
      return {
        text: word,
        startTime: wordStartTime,
        endTime: wordEndTime,
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      }
    })
    
    entries.push({
      id: `${callId}-entry-${i + 1}`,
      speakerId,
      speakerName,
      speakerRole,
      startTime,
      endTime,
      duration,
      text,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      words
    })
    
    // Update current time for next entry (add a small gap)
    currentTime = endTime + Math.random() * 2
  }
  
  return entries
}

/**
 * Helper function to generate sample analysis for a call
 */
function generateSampleAnalysis(callId: string): AnalysisResult {
  const transcript = transcripts[callId] || []
  const entryIds = transcript.map(entry => entry.id)
  
  return {
    callId,
    sentiment: {
      overall: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      score: Math.random() * 2 - 1, // -1 to 1
      bySpeaker: {
        'agent-1': {
          type: 'positive',
          score: Math.random() * 0.5 + 0.5 // 0.5 to 1
        },
        'customer-1': {
          type: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
          score: Math.random() * 2 - 1 // -1 to 1
        }
      },
      timeline: Array.from({ length: 10 }, (_, i) => ({
        time: i * (transcript.length > 0 ? transcript[transcript.length - 1].endTime / 10 : 30),
        type: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
        score: Math.random() * 2 - 1 // -1 to 1
      }))
    },
    topics: [
      {
        name: 'Order Status',
        keywords: ['order', 'shipping', 'delivery', 'status'],
        relevance: Math.random() * 0.3 + 0.7, // 0.7-1.0
        relatedEntryIds: entryIds.filter(() => Math.random() > 0.5)
      },
      {
        name: 'Customer Service',
        keywords: ['help', 'support', 'assistance', 'service'],
        relevance: Math.random() * 0.3 + 0.7, // 0.7-1.0
        relatedEntryIds: entryIds.filter(() => Math.random() > 0.5)
      },
      {
        name: 'Billing Issues',
        keywords: ['billing', 'payment', 'refund', 'charge'],
        relevance: Math.random() * 0.3 + 0.7, // 0.7-1.0
        relatedEntryIds: entryIds.filter(() => Math.random() > 0.5)
      }
    ],
    entities: [
      {
        text: 'Order #12345',
        type: 'order',
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        occurrences: [
          {
            transcriptEntryId: entryIds.length > 1 ? entryIds[1] : '',
            startPosition: 20,
            endPosition: 31
          }
        ]
      },
      {
        text: 'May 15th',
        type: 'date',
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        occurrences: [
          {
            transcriptEntryId: entryIds.length > 2 ? entryIds[2] : '',
            startPosition: 15,
            endPosition: 23
          }
        ]
      },
    ],
    actionItems: [
      {
        text: 'Send shipping confirmation email',
        assignee: 'Sarah Manager',
        priority: 'high',
        transcriptEntryId: entryIds.length > 0 ? entryIds[0] : ''
      },
      {
        text: 'Check order status in system',
        assignee: 'Shipping Department',
        priority: 'medium',
        transcriptEntryId: entryIds.length > 3 ? entryIds[3] : ''
      }
    ],
    keyMoments: [
      {
        type: 'problem',
        description: 'Customer reports missing shipping confirmation',
        transcriptEntryId: entryIds.length > 1 ? entryIds[1] : '',
        time: transcript.length > 1 ? transcript[1].startTime : 10
      },
      {
        type: 'solution',
        description: 'Agent promises to send shipping confirmation immediately',
        transcriptEntryId: entryIds.length > 2 ? entryIds[2] : '',
        time: transcript.length > 2 ? transcript[2].startTime : 20
      },
      {
        type: 'commitment',
        description: 'Agent commits to following up within 24 hours',
        transcriptEntryId: entryIds.length > 4 ? entryIds[4] : '',
        time: transcript.length > 4 ? transcript[4].startTime : 40
      }
    ],
    summary: 'Customer called inquiring about a missing shipping confirmation for their recent order. The agent checked the system and found that the order had been processed but the confirmation email failed to send. The agent promised to manually send the confirmation and follow up within 24 hours.',
    complianceIssues: Math.random() > 0.7 ? [
      {
        type: 'missing_disclosure',
        description: 'Agent failed to provide required disclosure statement',
        severity: 'medium',
        transcriptEntryId: entryIds.length > 0 ? entryIds[0] : ''
      }
    ] : undefined
  }
}

/**
 * Helper function to generate sample QA data for a call
 */
function generateSampleQAData(callId: string): QAData {
  const transcript = transcripts[callId] || []
  const entryIds = transcript.map(entry => entry.id)
  
  const reviewUser: User = {
    id: 'user-qa-1',
    name: 'Quality Manager',
    email: 'qa@example.com',
    role: UserRole.Manager
  }
  
  return {
    callId,
    score: Math.floor(Math.random() * 31) + 70, // 70-100
    status: Math.random() > 0.3 ? 'completed' : 'in-progress',
    evaluatedBy: reviewUser,
    evaluatedAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // within last week
    criteriaEvaluations: [
      {
        criterionId: 'greeting',
        score: Math.floor(Math.random() * 5) + 6, // 6-10
        comment: 'Agent provided appropriate greeting'
      },
      {
        criterionId: 'understanding',
        score: Math.floor(Math.random() * 5) + 6, // 6-10
        comment: 'Agent demonstrated good understanding of the issue'
      },
      {
        criterionId: 'resolution',
        score: Math.floor(Math.random() * 5) + 6, // 6-10
        comment: 'Agent resolved the issue effectively'
      },
      {
        criterionId: 'compliance',
        score: Math.floor(Math.random() * 5) + 6, // 6-10
        comment: 'Agent followed most compliance requirements'
      }
    ],
    notes: [
      {
        id: `${callId}-note-1`,
        text: 'Agent could have offered more empathy when customer expressed frustration',
        transcriptEntryId: entryIds.length > 3 ? entryIds[3] : '',
        createdBy: reviewUser,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // within last week
        category: 'suggestion'
      },
      {
        id: `${callId}-note-2`,
        text: 'Excellent explanation of the shipping process',
        transcriptEntryId: entryIds.length > 5 ? entryIds[5] : '',
        createdBy: reviewUser,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // within last week
        category: 'positive'
      }
    ],
    feedback: 'Overall good call handling. Agent was professional and resolved the customer issue efficiently. Some improvement needed in empathy and following all compliance steps.'
  }
}

/**
 * Helper function to generate sample call detail
 */
function generateSampleCallDetail(callId: string): CallDetail {
  const transcript = transcripts[callId] || []
  const totalDuration = transcript.length > 0 ? transcript[transcript.length - 1].endTime : 120

  return {
    id: callId,
    title: `Call with Customer ${callId.split('-')[1]}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 2592000000)).toISOString(), // within last month
    duration: Math.floor(totalDuration),
    agentId: 'agent-1',
    agentName: 'Sarah Manager',
    customerId: 'customer-1',
    customerName: 'John Customer',
    categories: ['Support', Math.random() > 0.5 ? 'Billing' : 'Technical'].filter(Boolean),
    status: CallStatus.Analyzed,
    tags: ['Important', Math.random() > 0.5 ? 'Follow-up' : 'Resolved'].filter(Boolean),
    score: Math.floor(Math.random() * 31) + 70, // 70-100
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
    complianceIssues: Math.random() > 0.7,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // within last week
    audio: {
      url: `/api/calls/${callId}/audio`,
      duration: Math.floor(totalDuration),
      format: 'mp3',
      size: Math.floor(Math.random() * 10000000) + 500000 // 500KB-10MB
    },
    transcriptMetadata: {
      available: true,
      segmentCount: transcript.length,
      wordCount: transcript.reduce((sum, entry) => sum + (entry.text?.split(' ').length || 0), 0),
      engine: 'Conista Transcribe v2',
      confidence: Math.floor(Math.random() * 11) + 90 // 90-100
    },
    analysisMetadata: {
      available: true,
      completedAt: new Date(Date.now() - Math.floor(Math.random() * 1209600000)).toISOString(), // within last 2 weeks
      version: '1.2.0'
    },
    qaMetadata: {
      status: Math.random() > 0.3 ? 'completed' : 'in-progress',
      reviewedBy: {
        id: 'user-qa-1',
        name: 'Quality Manager',
        email: 'qa@example.com',
        role: UserRole.Manager
      },
      reviewedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString() : undefined, // within last week
      score: Math.floor(Math.random() * 31) + 70 // 70-100
    }
  }
}

// Call Detail API handlers
export const callDetailHandlers = [
  // Get call detail by ID
  http.get('/api/calls/:id/detail', async ({ params }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const { id } = params
      const callDetail = callDetails[id as string]

      if (!callDetail) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'The requested call detail could not be found.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      return HttpResponse.json({ data: callDetail })
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

  // Get call transcript by ID
  http.get('/api/calls/:id/transcript', async ({ params }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const { id } = params
      const transcript = transcripts[id as string]

      if (!transcript) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'Transcript not found for the specified call.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      return HttpResponse.json({ data: transcript })
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

  // Get call analysis by ID
  http.get('/api/calls/:id/analysis', async ({ params }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const { id } = params
      const analysis = analysisResults[id as string]

      if (!analysis) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'Analysis not found for the specified call.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      return HttpResponse.json({ data: analysis })
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

  // Get call QA data by ID
  http.get('/api/calls/:id/qa', async ({ params }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const { id } = params
      const qa = qaData[id as string]

      if (!qa) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'QA data not found for the specified call.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      return HttpResponse.json({ data: qa })
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

  // Get call audio by ID (this would normally return a binary file, but we'll simulate it with metadata)
  http.get('/api/calls/:id/audio', async ({ params }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const { id } = params
      const callDetail = callDetails[id as string]

      if (!callDetail || !callDetail.audio) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'NOT_FOUND',
            message: 'Audio not found for the specified call.',
            details: { id }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 404 })
      }

      // In a real implementation, this would return the audio file
      // For this mock, we'll return metadata about the audio
      return HttpResponse.json({ 
        data: {
          message: "This is a mock audio endpoint that would normally return a binary audio file.",
          audioMetadata: callDetail.audio
        } 
      })
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
] 