// TEMPORARILY DISABLED HANDLERS FOR DEBUGGING
// import { authHandlers } from './auth'
// import { callHandlers } from './calls'

import { authHandlers } from './auth'
import { callsHandlers } from './calls'
import { callDetailHandlers } from './call-detail'
import { uploadHandlers } from './uploads'
import { settingsHandlers } from './settings'

console.log('Loading MSW handlers');

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...callsHandlers,
  ...callDetailHandlers,
  ...uploadHandlers,
  ...settingsHandlers,
];

console.log('MSW handlers loaded successfully');

export default handlers;
