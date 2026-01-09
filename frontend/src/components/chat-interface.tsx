'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTask } from '@/context/task-context';
import { useAuth } from '@/context/auth-context';
import { Send, Bot, User } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your task assistant. You can ask me to create, update, or manage your tasks.',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { createTask } = useTask(); // We'll use the API directly for complex operations

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserMessage = async (message: string) => {
    if (!user) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send the message to the backend chatbot API
      const response = await api.post('/api/chatbot/process', {
        message: message
      });

      const botResponse = response.data.data.response;

      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: error.response?.data?.detail || 'Sorry, I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await processUserMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[600px] border border-dark rounded-xl shadow-lg">
      <div className="bg-surface-dark px-4 py-3 border-b border-dark rounded-t-xl">
        <h3 className="text-lg font-medium text-primary">Boom Assistant</h3>
        <p className="text-sm text-secondary">Explode your productivity with AI</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-surface-dark">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary-action text-white rounded-br-none'
                    : 'bg-hover-surface text-primary rounded-bl-none'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' ? (
                    <Bot className="flex-shrink-0 w-4 h-4 mt-0.5" />
                  ) : (
                    <User className="flex-shrink-0 w-4 h-4 mt-0.5" />
                  )}
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary/70' : 'text-secondary'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-hover-surface text-primary rounded-xl rounded-bl-none px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div>Thinking...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-dark p-4 bg-surface-dark rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Explode your productivity with AI commands..."
            className="flex-1 border border-dark rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-action input-field"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary-action text-white px-4 py-2 rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-action disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-xs text-secondary">
          Examples: "Create a boom task called Buy groceries", "Explode shopping as complete"
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;