import type { Meta, StoryObj } from '@storybook/react';
import UploadPage from './UploadPage';
import { http, HttpResponse, delay } from 'msw';

const meta: Meta<typeof UploadPage> = {
  component: UploadPage,
  title: 'Pages/UploadPage',
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('/api/uploads/constraints', async () => {
          await delay(300);
          return HttpResponse.json({
            data: {
              maxFileSize: 50 * 1024 * 1024, // 50 MB
              allowedFileTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
              maxFilesPerBatch: 10
            }
          });
        }),
        http.post('/api/uploads/initiate', async ({ request }) => {
          await delay(500);
          try {
            const data = await request.json() as { fileName: string, fileType: string, fileSize: number };
            return HttpResponse.json({
              uploadId: `upload-${Date.now()}`,
              uploadUrl: `https://example.com/upload/${Date.now()}`,
              expectedHeaders: {
                'Content-Type': data.fileType
              },
              expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
            });
          } catch (error) {
            return new HttpResponse(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
          }
        }),
        http.post('/api/uploads/complete', async () => {
          await delay(500);
          return HttpResponse.json({
            callId: `call-${Date.now()}`,
            status: 'new',
            processingEstimate: '3 minutes'
          });
        })
      ]
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UploadPage>;

export const Default: Story = {}; 