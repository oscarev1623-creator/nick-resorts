"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, Users, MessageCircle, LogOut, Menu, X
} from "lucide-react"

const ADMIN_PASSWORD = "nickadmin2025"

function AdminSidebar({ isOpen, onClose, unreadCount }: { isOpen: boolean; onClose: () => void; unreadCount: number }) {
  const pathname = usePathname()
  
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Leads", href: "/admin", icon: Users },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
  ]
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300
        md:translate-x-0 md:w-64 md:relative
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B00] to-[#3DB54A] rounded-lg">
              <span className="text-white font-bold text-sm block text-center leading-8">NR</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#FF6B00]">Nick Resorts</h2>
              <p className="text-xs text-gray-500">Panel de Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-[#FF6B00]/10 text-[#FF6B00] font-semibold shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF6B00]' : 'text-gray-500'}`} />
                <span className="flex-1">{item.name}</span>
                {item.name === "Chat" && unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth')
              window.location.href = "/admin"
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  // Verificar autenticación al cargar
 useEffect(() => {
  // Verificar al cargar
  const auth = localStorage.getItem('admin_auth')
  if (auth === 'true') {
    setIsAuthenticated(true)
  }
  
  // Escuchar cambios en localStorage (por si se cierra sesión en otra pestaña)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'admin_auth') {
      setIsAuthenticated(e.newValue === 'true')
    }
  }
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])

  // Obtener mensajes no leídos
  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/conversations')
        const data = await res.json()
        if (Array.isArray(data)) {
          const total = data.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
          setUnreadCount(total)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 5000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
      setPasswordError(false)
      setPassword("")
    } else {
      setPasswordError(true)
      setPassword("")
    }
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF6B00]/10 to-[#3DB54A]/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF6B00] to-[#3DB54A] rounded-full flex items-center justify-center">
              <span className="text-3xl font-black text-white">N</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-center mb-2" style={{ color: "#FF6B00" }}>
            NICK RESORTS
          </h1>
          <p className="text-center text-gray-600 mb-8 font-semibold">Panel de Administración</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña de Acceso
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                placeholder="Ingresa la contraseña"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B00] transition-colors"
                autoFocus
              />
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                Contraseña incorrecta. Intenta de nuevo.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-lg transition-colors"
            >
              Acceder al Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Panel con sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
      
      <div className="flex-1 min-w-0">
        {/* Header móvil */}
        <div className="md:hidden bg-white border-b p-4 sticky top-0 z-30 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-bold text-[#FF6B00]">Nick Resorts</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}