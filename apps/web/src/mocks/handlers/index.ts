import { authHandlers } from './auth'
import { callHandlers } from './calls'

export const handlers = [...authHandlers, ...callHandlers]
