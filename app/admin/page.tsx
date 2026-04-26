"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Download, Check, AlertCircle, Loader2, InboxIcon, Phone, Mail, Calendar, MapPin,
  LayoutDashboard, Users, MessageCircle, LogOut, Menu, X, Trash2
} from "lucide-react"

interface Lead {
  id: string
  full_name: string
  email: string
  phone: string
  destination: string
  aeropuerto_salida?: string
  aeropuerto_codigo?: string
  arrival_date: string
  departure_date: string
  adults: number
  kids: number
  message?: string
  accept_promos: boolean
  created_at: string
  status?: string
}

// Componente Sidebar mejorado
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  // Obtener mensajes no leídos
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/conversations')
        const data = await res.json()
        if (Array.isArray(data)) {
          const total = data.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
          setUnreadCount(total)
        } else if (data.success && data.conversations) {
          const total = data.conversations.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
          setUnreadCount(total)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 5000)
    return () => clearInterval(interval)
  }, [])
  
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
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B00] to-[#3DB54A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NR</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#FF6B00]">Nick Resorts</h2>
              <p className="text-xs text-gray-500 mt-0.5">Panel de Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin")
            const isChat = item.name === "Chat"
            
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
                  ${isChat ? 'hover:bg-orange-50' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF6B00]' : 'text-gray-500'}`} />
                <span className="flex-1">{item.name}</span>
                
                {isChat && unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="px-4 py-3 mt-2">
          <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#3DB54A]/10 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-2">Acceso rápido</p>
            <Link
              href="/admin/chat"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-[#FF6B00] font-medium hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              Ir al Chat
              {unreadCount > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button 
            onClick={() => {
              window.location.href = "/admin?logout=true"
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ADMIN_PASSWORD = "nickadmin2025"

  // Verificar logout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('logout') === 'true') {
        setIsAuthenticated(false)
        window.history.replaceState({}, document.title, '/admin')
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads()
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
      setPassword("")
    } else {
      setPasswordError(true)
      setPassword("")
    }
  }

  const fetchLeads = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Error al cargar leads')
      
      setLeads(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar leads"
      setError(errorMessage)
      console.error("Error fetching leads:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar estado del lead
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId)
    try {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      })
      
      if (!response.ok) throw new Error('Error al actualizar')
      
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      )
    } catch (err) {
      console.error("Error updating lead:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Eliminar lead
  const deleteLead = async (leadId: string) => {
    if (!confirm('¿Eliminar este lead permanentemente?')) return
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' })
      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId))
      } else {
        alert('Error al eliminar el lead')
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Error al eliminar')
    }
  }

  const exportToCSV = () => {
    if (leads.length === 0) return

    const headers = [
      "Fecha", "Nombre", "Email", "Teléfono", "Destino", "Aeropuerto Salida",
      "Llegada", "Salida", "Adultos", "Niños", "Mensaje", "Recibe Promos", "Estado"
    ]

    const rows = leads.map((lead) => [
      new Date(lead.created_at).toLocaleDateString("es-ES"),
      lead.full_name,
      lead.email,
      lead.phone,
      lead.destination,
      lead.aeropuerto_salida || "",
      lead.arrival_date,
      lead.departure_date,
      lead.adults,
      lead.kids,
      lead.message || "",
      lead.accept_promos ? "Sí" : "No",
      lead.status || "pendiente",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
              <div className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">Contraseña incorrecta. Intenta de nuevo.</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              Acceder al Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Panel principal con sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
          {/* Header desktop */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black" style={{ color: "#FF6B00" }}>
                Panel de Leads — Nick Resorts
              </h1>
              <p className="text-gray-600">Gestiona todas las reservaciones</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#FF6B00] transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FF6B00]">
              <p className="text-gray-600 font-semibold text-sm mb-1">Total de Leads</p>
              <p className="text-3xl font-black" style={{ color: "#FF6B00" }}>{leads.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#3DB54A]">
              <p className="text-gray-600 font-semibold text-sm mb-1">Contactados</p>
              <p className="text-3xl font-black" style={{ color: "#3DB54A" }}>
                {leads.filter((l) => l.status === "contactado").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 font-semibold text-sm mb-1">Pendientes</p>
              <p className="text-3xl font-black text-blue-600">
                {leads.filter((l) => l.status === "pendiente").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <p className="text-gray-600 font-semibold text-sm mb-1">Pendiente Pago</p>
              <p className="text-3xl font-black text-orange-600">
                {leads.filter((l) => l.status === "pendiente_pago").length}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={exportToCSV}
              disabled={leads.length === 0 || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" /> Exportar a CSV
            </button>
            <button
              onClick={fetchLeads}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Lista"}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-bold text-gray-600 mb-2">No hay leads registrados</p>
                <p className="text-gray-500 text-center max-w-md">
                  Aún no se han recibido reservaciones. Los leads aparecerán aquí cuando los usuarios completen el formulario.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Fecha</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Contacto</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Destino</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Fechas</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Pax</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {new Date(lead.created_at).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{lead.full_name}</div>
                          {lead.aeropuerto_salida && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {lead.aeropuerto_salida}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-700 text-xs">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[120px]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
                            <Phone className="w-3 h-3 text-gray-400" /> {lead.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium text-sm">
                          {lead.destination === "punta-cana" ? "Punta Cana" : "Riviera Maya"}
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-xs">
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> {lead.arrival_date}</div>
                          <div className="flex items-center gap-1 mt-1"><Calendar className="w-3 h-3 text-gray-400" /> {lead.departure_date}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-900 text-sm">
                          <div>👤 {lead.adults} {lead.adults === 1 ? "adulto" : "adultos"}</div>
                          <div className="text-gray-500">👶 {lead.kids} {lead.kids === 1 ? "niño" : "niños"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status || "pendiente"}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            disabled={updatingId === lead.id}
                            className={`px-2 py-1 rounded-full text-xs font-bold border-none cursor-pointer ${
                              lead.status === "contactado" ? "bg-green-100 text-green-700" :
                              lead.status === "pendiente_pago" ? "bg-orange-100 text-orange-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            <option value="pendiente">⏳ Pendiente</option>
                            <option value="contactado">✓ Contactado</option>
                            <option value="pendiente_pago">💰 Pendiente Pago</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>Nick Resorts — Panel de Administración</p>
            <p>Total de leads: {leads.length} | Última actualización: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}