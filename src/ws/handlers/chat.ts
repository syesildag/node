import { chatService } from '../../services/chat-service';

export default function handleChatConnection(ws: any, req: any) {
  ws.on('message', async (data: Buffer) => {
     try {
        const message = JSON.parse(data.toString());

        if (message.type === 'chat_message') {
           const { content, sessionId, stream, model, temperature } = message;

           if (stream) {
              // Handle streaming response
              try {
                 let accumulatedContent = '';
                 for await (const chunk of chatService.streamMessage({
                    messages: [{ role: 'user', content }],
                    model: model || 'gpt-3.5-turbo',
                    temperature: temperature || 0.7,
                    sessionId
                 })) {
                    accumulatedContent += chunk;
                    ws.send(JSON.stringify({
                       type: 'stream_chunk',
                       chunk,
                       messageId: Date.now().toString()
                    }));
                 }

                 // Send completion message
                 ws.send(JSON.stringify({
                    type: 'stream_end',
                    messageId: Date.now().toString(),
                    content: accumulatedContent,
                    timestamp: new Date().toISOString()
                 }));

              } catch (error) {
                 console.error('Streaming error:', error);
                 ws.send(JSON.stringify({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Streaming failed'
                 }));
              }
           } else {
              // Handle regular response
              try {
                 const response = await chatService.sendMessage({
                    messages: [{ role: 'user', content }],
                    model: model || 'gpt-3.5-turbo',
                    temperature: temperature || 0.7,
                    sessionId
                 });

                 ws.send(JSON.stringify({
                    type: 'chat_response',
                    content: response.choices[0].message.content,
                    messageId: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    metadata: {
                       usage: response.usage
                    }
                 }));

              } catch (error) {
                 console.error('Chat error:', error);
                 ws.send(JSON.stringify({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Chat request failed'
                 }));
              }
           }
        }
     } catch (error) {
        console.error('WebSocket message parsing error:', error);
        ws.send(JSON.stringify({
           type: 'error',
           message: 'Invalid message format'
        }));
     }
  });

  ws.on('close', () => {
     console.log('Chat WebSocket connection closed');
  });

  ws.on('error', (error: Error) => {
     console.error('Chat WebSocket error:', error);
  });
}