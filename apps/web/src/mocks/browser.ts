import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

console.log('MSW browser module loaded, about to setup worker');

// Initialize the MSW worker
export const worker = setupWorker(...handlers)

console.log('MSW worker setup complete');

// Export for browser initialization
export default worker
