"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Download, Check, AlertCircle, Loader2, InboxIcon, Eye, Phone, Mail, Calendar, MapPin } from "lucide-react"

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const ADMIN_PASSWORD = "nickadmin2025"

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
      const { data, error: supabaseError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })

      if (supabaseError) throw supabaseError

      setLeads(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar leads"
      setError(errorMessage)
      console.error("Error fetching leads:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsContacted = async (leadId: string) => {
    setUpdatingId(leadId)
    try {
      const { error: supabaseError } = await supabase
        .from("leads")
        .update({ status: "contactado" })
        .eq("id", leadId)

      if (supabaseError) throw supabaseError

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: "contactado" } : lead))
      )
    } catch (err) {
      console.error("Error updating lead:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const exportToCSV = () => {
    if (leads.length === 0) return

    const headers = [
      "Fecha",
      "Nombre",
      "Email",
      "Teléfono",
      "Destino",
      "Aeropuerto Salida",
      "Llegada",
      "Salida",
      "Adultos",
      "Niños",
      "Mensaje",
      "Recibe Promos",
      "Estado",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: "#FF6B00" }}>
              Panel de Leads — Nick Resorts
            </h1>
            <p className="text-gray-600 font-medium">Gestiona todas las reservaciones</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-[#FF6B00] transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FF6B00]">
            <p className="text-gray-600 font-semibold text-sm mb-1">Total de Leads</p>
            <p className="text-3xl font-black" style={{ color: "#FF6B00" }}>
              {leads.length}
            </p>
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
              {leads.filter((l) => l.status !== "contactado").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 font-semibold text-sm mb-1">Adultos Totales</p>
            <p className="text-3xl font-black text-purple-600">
              {leads.reduce((sum, l) => sum + l.adults, 0)}
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
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={exportToCSV}
            disabled={leads.length === 0 || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Exportar a CSV
          </button>
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors duration-200"
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
                Aún no se han recibido reservaciones. Los leads aparecerán aquí cuando los usuarios completen el formulario de reserva.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Fecha</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Nombre</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Contacto</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Destino</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Fechas</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Pax</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {new Date(lead.created_at).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{lead.full_name}</div>
                        {lead.aeropuerto_salida && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.aeropuerto_salida}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-700 text-sm mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {lead.destination === "punta-cana" ? "Punta Cana" : "Riviera Maya"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {lead.arrival_date}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {lead.departure_date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        <div className="text-sm">
                          👤 {lead.adults} {lead.adults === 1 ? "adulto" : "adultos"}
                        </div>
                        <div className="text-sm text-gray-500">
                          👶 {lead.kids} {lead.kids === 1 ? "niño" : "niños"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            lead.status === "contactado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {lead.status === "contactado" ? "✓ Contactado" : "⏳ Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {lead.status !== "contactado" && (
                          <button
                            onClick={() => markAsContacted(lead.id)}
                            disabled={updatingId === lead.id}
                            className="flex items-center justify-center gap-1 mx-auto px-4 py-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:bg-gray-300 text-white text-xs font-bold rounded-lg transition-colors duration-200"
                          >
                            {updatingId === lead.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3 h-3" />
                                Marcar
                              </>
                            )}
                          </button>
                        )}
                        {lead.status === "contactado" && (
                          <span className="text-xs text-green-600 font-medium">Completado</span>
                        )}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Nick Resorts — Panel de Administración</p>
          <p>Total de leads: {leads.length} | Última actualización: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}