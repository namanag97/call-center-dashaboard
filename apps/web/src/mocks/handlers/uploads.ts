import { http, HttpResponse, delay } from 'msw'
import { 
  UploadInitiateResponse, 
  UploadCompleteResponse, 
  ApiErrorResponse, 
  UploadMetadata,
  CallStatus
} from '@conista/shared-types'

/**
 * MSW handlers for call upload endpoints
 */
export const uploadHandlers = [
  // Initiate upload (get pre-signed URL)
  http.post('/api/uploads/initiate', async ({ request }) => {
    await delay(Math.floor(Math.random() * 500) + 300) // 300-800ms delay

    try {
      const data = await request.json() as { fileName: string, fileSize: number, fileType: string }
      
      // Simulate file size check
      if (data.fileSize > 50 * 1024 * 1024) { // 50 MB limit
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'The file exceeds the maximum size limit of 50 MB.',
            details: { 
              maxSizeBytes: 50 * 1024 * 1024,
              uploadedSizeBytes: data.fileSize
            }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 400 })
      }
      
      // Simulate file type check
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg']
      if (!allowedTypes.includes(data.fileType)) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'The file type is not supported.',
            details: { 
              allowedTypes,
              uploadedType: data.fileType
            }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 400 })
      }
      
      // Generate a fake upload ID
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
      
      // Return the pre-signed URL (would be from S3 or similar in real implementation)
      const response: UploadInitiateResponse = {
        uploadId,
        uploadUrl: `https://example.com/upload/${uploadId}`,
        expectedHeaders: {
          'Content-Type': data.fileType,
          'x-amz-acl': 'private',
        },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      }
      
      return HttpResponse.json(response)
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

  // Simulate file upload (in real implementation, this would be a direct upload to a storage service)
  http.put('https://example.com/upload/:uploadId', async ({ params }) => {
    await delay(Math.floor(Math.random() * 2000) + 1000) // 1-3s delay to simulate upload
    
    // 5% chance of random upload failure
    if (Math.random() < 0.05) {
      return new HttpResponse(null, { status: 500 })
    }
    
    return new HttpResponse(null, { status: 200 })
  }),

  // Complete upload (after file is uploaded to storage)
  http.post('/api/uploads/complete', async ({ request }) => {
    await delay(Math.floor(Math.random() * 700) + 300) // 300-1000ms delay

    try {
      const data = await request.json() as { uploadId: string, metadata: UploadMetadata }
      
      // Validate required metadata
      if (!data.metadata?.title || !data.metadata?.date || !data.metadata?.agentId) {
        const errorResponse: ApiErrorResponse = {
          error: {
            code: 'INVALID_METADATA',
            message: 'Required metadata is missing.',
            details: { 
              required: ['title', 'date', 'agentId'],
            }
          }
        }
        return new HttpResponse(JSON.stringify(errorResponse), { status: 400 })
      }
      
      // Generate a new call ID
      const callId = `call-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      
      // Return the completed upload info
      const response: UploadCompleteResponse = {
        callId,
        status: CallStatus.New,
        processingEstimate: '3 minutes'
      }
      
      return HttpResponse.json(response)
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

  // Get upload constraints (file size limits, allowed types)
  http.get('/api/uploads/constraints', async () => {
    await delay(Math.floor(Math.random() * 300) + 200) // 200-500ms delay
    
    return HttpResponse.json({
      data: {
        maxFileSize: 50 * 1024 * 1024, // 50 MB
        allowedFileTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
        maxFilesPerBatch: 10
      }
    })
  }),

  // Get upload status
  http.get('/api/uploads/:uploadId/status', async ({ params }) => {
    await delay(Math.floor(Math.random() * 300) + 200) // 200-500ms delay
    
    const { uploadId } = params
    
    // Random progress for demonstration purposes
    const progress = Math.random() * 100
    
    if (progress < 100) {
      return HttpResponse.json({
        data: {
          uploadId,
          status: 'in_progress',
          progress: Math.round(progress),
        }
      })
    } else {
      return HttpResponse.json({
        data: {
          uploadId,
          status: 'completed',
          progress: 100,
          callId: `call-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        }
      })
    }
  }),
] 