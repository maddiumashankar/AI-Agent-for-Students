import React, { useState, FormEvent, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface QAResponse {
  question: string;
  answer: string;
  contentId?: string;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

const ChatAssistantPage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [contextId, setContextId] = useState<string>(''); // To provide context for the chat
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentMessage.trim() || !contextId.trim()) {
      setErrorMessage('Please enter a message and a Content ID for context.');
      return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: currentMessage };
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentMessage(''); // Clear input after sending

    try {
      // Backend expects 'question', 'context' (or 'contentId')
      // We'll use contentId to fetch context on the backend (placeholder behavior)
      const response = await axios.post<QAResponse>(`${API_BASE_URL}/content/answer-question`, {
        question: currentMessage,
        contentId: contextId,
        // context: `Context related to ID: ${contextId}` // Or send context directly if preferred by backend
      });

      const aiMessage: ChatMessage = { sender: 'ai', text: response.data.answer };
      setChatHistory(prevHistory => [...prevHistory, aiMessage]);

    } catch (error) { // Corrected: Added opening curly brace
      console.error('API Error sending message:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      let errorText = 'Failed to get a response from the assistant.';
      if (axiosError.response && axiosError.response.data) {
        errorText = `Error: ${axiosError.response.data.error} ${axiosError.response.data.details || ''}`;
      } else if (axiosError.request) {
        errorText = 'Error: No response received from server.';
      } else {
        errorText = `Error: ${axiosError.message}`;
      }
      setErrorMessage(errorText);
      // Optionally add error message to chat history
      // setChatHistory(prevHistory => [...prevHistory, { sender: 'ai', text: errorText, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-4 sm:p-8 max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">Chat Assistant</h1>

      <div className="mb-4">
        <label htmlFor="context-id" className="block text-sm font-medium text-gray-700">
          Content ID (for chat context)
        </label>
        <input
          type="text"
          name="context-id"
          id="context-id"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter Content ID for context"
          value={contextId}
          onChange={(e) => setContextId(e.target.value)}
        />
      </div>

      <div ref={chatContainerRef} className="flex-grow bg-gray-50 p-4 rounded-lg overflow-y-auto mb-4 border border-gray-200 min-h-[200px]">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`mb-3 ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 px-3 rounded-lg ${
              chat.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
              {chat.text}
            </span>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length-1].sender === 'user' && (
            <div className="text-left">
                <span className="inline-block p-2 px-3 rounded-lg bg-gray-200 text-gray-500 italic">
                    AI is thinking...
                </span>
            </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 mb-4 text-sm bg-red-100 text-red-700 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask a question about the content..."
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading || !contextId.trim()}
        />
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isLoading || !currentMessage.trim() || !contextId.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatAssistantPage;
