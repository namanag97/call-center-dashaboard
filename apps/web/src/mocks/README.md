# Mock Service Worker (MSW)

This directory contains mock API handlers used for development and testing. MSW intercepts API requests at the network level and provides mock responses based on defined handlers.

## Structure

- `browser.ts`: Setup for the MSW browser worker
- `handlers/`: Contains all API handlers organized by domain
  - `auth.ts`: Authentication API handlers
  - `calls.ts`: Call-related API handlers
  - `index.ts`: Combines all handlers for export

## How It Works

MSW is initialized in `main.tsx` only in development mode. It intercepts API requests to the defined endpoints and returns mock responses.

## Adding New Handlers

To add a new API handler:

1. Create a new file in the `handlers` directory for your domain
2. Define your handlers using the MSW syntax
3. Export your handlers and include them in `handlers/index.ts`

## Example Handler

```ts
import { http, HttpResponse, delay } from 'msw'

export const exampleHandlers = [
  http.get('/api/example', async () => {
    // Add a realistic delay
    await delay(300)
    
    return HttpResponse.json({
      data: 'Example response'
    })
  })
]
```

For more information on MSW, see [the official documentation](https://mswjs.io/). 