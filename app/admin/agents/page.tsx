"use client"

import { useEffect, useState } from "react"
import { UserPlus, UserCheck, UserX } from "lucide-react"

type Agent = {
  id: string
  name: string
  email: string
  color?: string
  is_active: boolean
}

const COLORS = ["orange", "green", "blue", "purple", "pink", "yellow", "red", "cyan"]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [color, setColor] = useState("orange")

  const loadAgents = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/agents?all=true", { cache: "no-store" })
      const data = await res.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, color }),
    })
    const data = await res.json()
    if (!data.success) {
      alert(data.error || "No se pudo crear el asesor")
      return
    }
    setName("")
    setEmail("")
    setColor("orange")
    await loadAgents()
  }

  const toggleAgent = async (agent: Agent) => {
    const res = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !agent.is_active }),
    })
    const data = await res.json()
    if (!data.success) {
      alert(data.error || "No se pudo actualizar el asesor")
      return
    }
    await loadAgents()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#FF6B00]">Asesores</h1>
        <p className="text-sm text-gray-500">Crea y administra los asesores del chat</p>
      </div>

      <form onSubmit={createAgent} className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <UserPlus className="w-5 h-5 text-[#FF6B00]" />
          Nuevo asesor
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg font-semibold">
          Guardar asesor
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-800">Lista de asesores</div>
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Cargando...</div>
        ) : agents.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No hay asesores activos</div>
        ) : (
          <div className="divide-y">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                </div>
                <button
                  onClick={() => toggleAgent(agent)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 ${
                    agent.is_active ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                  }`}
                >
                  {agent.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  {agent.is_active ? "Desactivar" : "Activar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
