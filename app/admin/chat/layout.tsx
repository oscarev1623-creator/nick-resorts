"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, Home, LogOut } from 'lucide-react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener mensajes no leídos
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/conversations');
      const conversations = await res.json();
      const total = conversations.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
      setUnreadCount(total);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para escritorio */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-20 hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-black text-[#FF6B00]">Nick Resorts</h2>
          <p className="text-xs text-gray-500">Panel de Asesor</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/chat"
            className="flex items-center gap-3 px-4 py-3 bg-[#FF6B00]/10 text-[#FF6B00] rounded-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/agents"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Asesores</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 w-full">
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}