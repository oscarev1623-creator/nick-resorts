"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, AlertCircle, Loader2, InboxIcon, Phone, Mail, Calendar, MapPin, Trash2 } from "lucide-react"

interface Lead {
  id: string
  full_name: string
  email: string
  phone: string
  destination: string
  aeropuerto_salida?: string
  arrival_date: string
  departure_date: string
  adults: number
  kids: number
  message?: string
  accept_promos: boolean
  created_at: string
  status?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

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

  const openLeadChat = (lead: Lead) => {
    const query = new URLSearchParams({
      leadId: lead.id,
      email: lead.email,
      name: lead.full_name,
      phone: lead.phone || "",
    })
    router.push(`/admin/chat?${query.toString()}`)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="hidden md:flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black" style={{ color: "#FF6B00" }}>
            Panel de Leads — Nick Resorts
          </h1>
          <p className="text-gray-600">Gestiona todas las reservaciones</p>
        </div>
      </div>

          {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FF6B00]">
          <p className="text-gray-600 font-semibold text-sm mb-1">Total de Leads</p>
          <p className="text-3xl font-black text-[#FF6B00]">{leads.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#3DB54A]">
          <p className="text-gray-600 font-semibold text-sm mb-1">Contactados</p>
          <p className="text-3xl font-black text-[#3DB54A]">
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0 || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-lg text-sm"
        >
          <Download className="w-4 h-4" /> Exportar a CSV
        </button>
        <button
          onClick={fetchLeads}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg text-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Lista"}
        </button>
      </div>

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
                    <td className="px-4 py-3 text-gray-900 font-medium">{new Date(lead.created_at).toLocaleDateString("es-ES")}</td>
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
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openLeadChat(lead)}
                          className="px-2 py-1 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
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
  )
}