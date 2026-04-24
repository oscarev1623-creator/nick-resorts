"use client"

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_type: 'cliente' | 'asesor';
  created_at: string;
}

interface ChatWidgetProps {
  leadId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export default function ChatWidget({ leadId, userEmail, userName, userPhone }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!userEmail);
  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: userPhone || '',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Crear conversación al iniciar
  const createConversation = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          user_email: formData.email,
          user_name: formData.name,
          user_phone: formData.phone,
        }),
      });
      
      const data = await res.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  // Cargar mensajes
  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_type: 'cliente',
          sender_name: formData.name,
          content: input.trim(),
        }),
      });
      
      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling para nuevos mensajes
  useEffect(() => {
    if (conversationId && isOpen && !isMinimized) {
      loadMessages(conversationId);
      pollInterval.current = setInterval(() => {
        loadMessages(conversationId);
      }, 3000);
      
      return () => {
        if (pollInterval.current) clearInterval(pollInterval.current);
      };
    }
  }, [conversationId, isOpen, isMinimized]);

  // Enviar formulario inicial
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    const convId = await createConversation();
    if (convId) {
      setShowForm(false);
      await loadMessages(convId);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#FF6B00] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 flex flex-col ${
      isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] rounded-t-2xl">
        <div>
          <h3 className="font-bold text-white">Nick Resorts</h3>
          <p className="text-xs text-white/80">Chat de soporte</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {showForm ? (
              <form onSubmit={handleSubmitForm} className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Completa tus datos para comenzar</p>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF6B00]"
                  required
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF6B00]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Tu teléfono (opcional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF6B00]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] text-white font-bold py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
                >
                  Iniciar Chat
                </button>
              </form>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'cliente' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.sender_type === 'cliente'
                          ? 'bg-[#FF6B00] text-white rounded-br-md'
                          : 'bg-white border text-gray-700 rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className="text-[10px] opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {!showForm && conversationId && (
            <div className="p-4 border-t bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-[#FF6B00]"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#FF6B00] text-white p-2 rounded-full hover:bg-[#E55A00] transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}