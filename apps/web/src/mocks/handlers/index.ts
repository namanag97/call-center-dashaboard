// TEMPORARILY DISABLED HANDLERS FOR DEBUGGING
// import { authHandlers } from './auth'
// import { callHandlers } from './calls'

import { authHandlers } from './auth'
import { callHandlers } from './calls'

console.log('Loading MSW handlers');

// Combine all handlers
export const handlers = [...authHandlers, ...callHandlers]

console.log('MSW handlers loaded successfully');
