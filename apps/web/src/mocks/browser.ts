import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Initialize the MSW worker
export const worker = setupWorker(...handlers)

// Export for browser initialization
export default worker
