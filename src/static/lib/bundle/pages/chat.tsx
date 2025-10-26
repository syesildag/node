import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../../../hooks/useChat";
import Page from "../../../../react/page";

export default class Chat extends Page {
   render() {
      return super.render(<ChatComponent />);
   }
}

function ChatComponent() {
   const [inputMessage, setInputMessage] = useState("");
   const [isTyping, setIsTyping] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const {
      messages,
      isLoading,
      error,
      sessionId,
      sendMessage,
      clearMessages,
      createSession,
      exportHistory,
      importHistory
   } = useChat({
      autoCreateSession: true,
      onMessage: (message) => {
         if (message.role === 'assistant') {
            setIsTyping(false);
         }
      },
      onError: (error) => {
         console.error('Chat error:', error);
         setIsTyping(false);
      },
      onStream: (chunk) => {
         setIsTyping(true);
      }
   });

   // Auto-scroll to bottom when new messages arrive
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   // Focus input on mount
   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputMessage.trim() || isLoading) return;

      const messageToSend = inputMessage.trim();
      setInputMessage("");
      setIsTyping(true);

      try {
         await sendMessage(messageToSend, { stream: true });
      } catch (error) {
         console.error('Failed to send message:', error);
         setIsTyping(false);
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSendMessage(e as any);
      }
   };

   const handleNewSession = () => {
      createSession();
      clearMessages();
   };

   const handleExport = () => {
      const history = exportHistory();
      const blob = new Blob([history], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${sessionId || 'session'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
   };

   const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         const content = event.target?.result as string;
         if (content) {
            importHistory(content);
         }
      };
      reader.readAsText(file);
   };

   return (
      <div style={{
         display: 'flex',
         flexDirection: 'column',
         height: '100vh',
         backgroundColor: '#f5f5f5',
         fontFamily: 'Arial, sans-serif'
      }}>
         {/* Header */}
         <div style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
         }}>
            <div>
               <h1 style={{ margin: 0, fontSize: '1.5rem' }}>AI Chat Assistant</h1>
               <small style={{ opacity: 0.8 }}>
                  Session: {sessionId ? sessionId.slice(0, 8) : 'None'}
               </small>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button
                  onClick={handleNewSession}
                  style={{
                     padding: '0.5rem 1rem',
                     backgroundColor: '#3498db',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer'
                  }}
               >
                  New Session
               </button>
               <button
                  onClick={clearMessages}
                  style={{
                     padding: '0.5rem 1rem',
                     backgroundColor: '#e74c3c',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer'
                  }}
               >
                  Clear Chat
               </button>
               <button
                  onClick={handleExport}
                  style={{
                     padding: '0.5rem 1rem',
                     backgroundColor: '#27ae60',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer'
                  }}
               >
                  Export
               </button>
               <label style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'inline-block'
               }}>
                  Import
                  <input
                     type="file"
                     accept=".json"
                     onChange={handleImport}
                     style={{ display: 'none' }}
                  />
               </label>
            </div>
         </div>

         {/* Messages Container */}
         <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
         }}>
            {messages.length === 0 && !isLoading && (
               <div style={{
                  textAlign: 'center',
                  color: '#666',
                  fontStyle: 'italic',
                  marginTop: '2rem'
               }}>
                  Start a conversation by typing a message below...
               </div>
            )}

            {messages.map((message) => (
               <div
                  key={message.id}
                  style={{
                     display: 'flex',
                     justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                     marginBottom: '0.5rem'
                  }}
               >
                  <div style={{
                     maxWidth: '70%',
                     padding: '0.75rem 1rem',
                     borderRadius: '18px',
                     backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
                     color: message.role === 'user' ? 'white' : '#333',
                     wordWrap: 'break-word',
                     boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                     <div style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                     </div>
                     <small style={{
                        opacity: 0.7,
                        fontSize: '0.75rem',
                        marginTop: '0.25rem',
                        display: 'block'
                     }}>
                        {message.timestamp.toLocaleTimeString()}
                     </small>
                  </div>
               </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
               <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem'
               }}>
                  <div style={{
                     padding: '0.75rem 1rem',
                     borderRadius: '18px',
                     backgroundColor: '#e9ecef',
                     color: '#333',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.25rem'
                  }}>
                     <div>AI is typing</div>
                     <div style={{
                        display: 'flex',
                        gap: '2px'
                     }}>
                        <div className="typing-dot" style={{
                           width: '4px',
                           height: '4px',
                           backgroundColor: '#666',
                           borderRadius: '50%',
                           animation: 'typing 1.4s infinite ease-in-out'
                        }}></div>
                        <div className="typing-dot" style={{
                           width: '4px',
                           height: '4px',
                           backgroundColor: '#666',
                           borderRadius: '50%',
                           animation: 'typing 1.4s infinite ease-in-out 0.2s'
                        }}></div>
                        <div className="typing-dot" style={{
                           width: '4px',
                           height: '4px',
                           backgroundColor: '#666',
                           borderRadius: '50%',
                           animation: 'typing 1.4s infinite ease-in-out 0.4s'
                        }}></div>
                     </div>
                  </div>
               </div>
            )}

            <div ref={messagesEndRef} />
         </div>

         {/* Error Display */}
         {error && (
            <div style={{
               backgroundColor: '#f8d7da',
               color: '#721c24',
               padding: '0.75rem 1rem',
               border: '1px solid #f5c6cb',
               borderRadius: '4px',
               margin: '0 1rem 0.5rem 1rem'
            }}>
               <strong>Error:</strong> {error.message}
            </div>
         )}

         {/* Input Form */}
         <form
            onSubmit={handleSendMessage}
            style={{
               padding: '1rem',
               backgroundColor: 'white',
               borderTop: '1px solid #ddd',
               display: 'flex',
               gap: '0.5rem',
               alignItems: 'center'
            }}
         >
            <input
               ref={inputRef}
               type="text"
               value={inputMessage}
               onChange={(e) => setInputMessage(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder="Type your message..."
               disabled={isLoading}
               style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  outline: 'none'
               }}
            />
            <button
               type="submit"
               disabled={!inputMessage.trim() || isLoading}
               style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (!inputMessage.trim() || isLoading) ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
               }}
            >
               {isLoading ? 'Sending...' : 'Send'}
            </button>
         </form>

         {/* CSS Animations */}
         <style>{`
            @keyframes typing {
               0%, 60%, 100% {
                  transform: translateY(0);
               }
               30% {
                  transform: translateY(-10px);
               }
            }
         `}</style>
      </div>
   );
}