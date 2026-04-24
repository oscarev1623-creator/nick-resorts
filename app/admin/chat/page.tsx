"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, Clock, CheckCircle2 } from 'lucide-react';

interface Conversation {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  status: string;
  created_at: string;
}

export default function ChatListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Chat con Clientes</h1>
            <p className="text-sm text-gray-500">Gestiona las conversaciones</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF6B00] w-64"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={fetchConversations}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-600">No hay conversaciones</p>
            <p className="text-sm text-gray-400">Los clientes se comunicarán aquí</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/admin/chat/${conv.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-[#FF6B00]/30"
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF8C42]/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-[#FF6B00]">
                        {conv.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{conv.user_name}</h3>
                        {conv.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unread_count} nuevo{conv.unread_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate max-w-md">{conv.user_email}</p>
                      {conv.user_phone && (
                        <p className="text-xs text-gray-400 mt-1">{conv.user_phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {conv.last_message_time
                        ? new Date(conv.last_message_time).toLocaleDateString('es-ES')
                        : new Date(conv.created_at).toLocaleDateString('es-ES')}
                    </p>
                    {conv.status === 'activo' && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Activo
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}