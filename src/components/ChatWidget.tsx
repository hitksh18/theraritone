'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessage, fetchMessages, sendGuestMessage, ChatMessage } from '@/lib/chat';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const welcomeMessage = "Hi there! How can I assist you today in finding the perfect fit?";

  useEffect(() => {
    if (user && isOpen) {
      const unsubscribe = fetchMessages(user.uid, (msgs) => {
        setMessages(msgs);
      });
      return unsubscribe;
    }
  }, [user, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        userId: 'assistant',
        message: welcomeMessage,
        timestamp: new Date(),
        isAdmin: true
      }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "I'd be happy to help you find the perfect outfit!",
        "Let me assist you with your fashion needs.",
        "What style are you looking for today?",
        "I can help you with sizing, styling, or product recommendations."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId: 'assistant',
        message: randomResponse,
        timestamp: new Date(),
        isAdmin: true
      }]);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      userId: user?.uid || guestEmail,
      message: newMessage,
      timestamp: new Date(),
      isAdmin: false
    };

    setMessages(prev => [...prev, userMessage]);

    if (user) {
      await sendMessage(user.uid, newMessage);
    } else if (guestEmail) {
      await sendGuestMessage(guestEmail, newMessage);
    }

    setNewMessage('');
    simulateTyping();
  };

  const handleGuestEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      setShowEmailForm(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!user && !isOpen) {
      setShowEmailForm(true);
    }
  };

  return (
    <>
      {/* LUXURY CHAT BUTTON */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-40 px-6 py-4 rounded-full transition-all duration-300 luxury-chat flex items-center space-x-3 luxury-glow hover-lift"
      >
        {/* Logo container */}
        <div className="w-10 h-10 relative rounded-full overflow-hidden flex items-center justify-center border-2 border-[var(--border-color)]">
          <img
            src="/R.png"
            alt="RARITONE Chat"
            className="w-8 h-8 object-contain"
            style={{
              maxWidth: '40px',
              maxHeight: '40px'
            }}
          />
        </div>
        <span className="font-bold text-[var(--text-primary)] text-base">
          Chat with us
        </span>
      </button>

      {/* LUXURY CHAT MODAL */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-96 rounded-2xl overflow-hidden luxury-chat transition-all duration-300 shadow-2xl">
          {/* Header */}
          <div className="text-[var(--text-primary)] p-6 flex items-center justify-between border-b-2 border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[var(--border-color)]">
                <img
                  src="/R.png"
                  alt="RARITONE"
                  className="w-8 h-8 object-contain"
                  style={{
                    maxWidth: '40px',
                    maxHeight: '40px'
                  }}
                />
              </div>
              <span className="font-bold text-base">Chat with a client advisor</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-[var(--accent-color)] hover:text-[var(--main-bg)] rounded-lg transition-colors"
              >
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--accent-color)] hover:text-[var(--main-bg)] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div>
              {/* Guest Email Form */}
              {showEmailForm && !user && (
                <div className="p-4 border-b border-[var(--border-color)]">
                  <h4 className="font-medium mb-2 text-white">Privacy Notice</h4>
                  <form onSubmit={handleGuestEmailSubmit} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="luxury-input w-full"
                      required
                    />
                    <p className="text-xs text-[var(--secondary-accent)]">
                      Your personal data is collected in the course of providing remote chat assistance and will be processed in full compliance with our privacy policy.
                    </p>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="accept" required className="rounded" />
                      <label htmlFor="accept" className="text-xs text-[var(--secondary-accent)]">I accept</label>
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary py-2 rounded-md font-medium"
                    >
                      Start chat
                    </button>
                  </form>
                </div>
              )}

              {/* Chat Messages */}
              {(user || (!showEmailForm && guestEmail)) && (
                <>
                  <div className="h-64 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            message.isAdmin
                              ? 'luxury-card border border-[var(--border-color)]'
                              : 'bg-[var(--primary-accent)] text-black'
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="luxury-card text-[var(--text-primary)] px-3 py-2 rounded-lg text-sm border border-[var(--border-color)]">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[var(--secondary-accent)] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[var(--secondary-accent)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[var(--secondary-accent)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-[var(--border-color)]">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 luxury-input"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 btn-primary rounded-full font-medium"
                      >
                        <Send size={16} />
                      </button>
                      <button className="px-4 py-2 btn-secondary rounded-full">
                        <Mic size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;