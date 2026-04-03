"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { airports, filterAirports, type Airport } from "@/lib/airports"

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  email: string
  phone: string
  destination: string
  departureAirport: string
  departureAirportCode: string
  arrivalDate: string
  departureDate: string
  adults: number
  kids: number
  message: string
  acceptPromos: boolean
}

interface FormErrors {
  [key: string]: string
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    destination: "punta-cana",
    departureAirport: "",
    departureAirportCode: "",
    arrivalDate: "",
    departureDate: "",
    adults: 1,
    kids: 0,
    message: "",
    acceptPromos: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [airportSearch, setAirportSearch] = useState("")
  const [showAirportDropdown, setShowAirportDropdown] = useState(false)
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [customAirport, setCustomAirport] = useState("")

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    }

    if (!formData.departureAirport && !customAirport) {
      newErrors.departureAirport = "El aeropuerto de salida es requerido"
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = "La fecha de llegada es requerida"
    }

    if (!formData.departureDate) {
      newErrors.departureDate = "La fecha de salida es requerida"
    }

    if (formData.arrivalDate && formData.departureDate) {
      if (new Date(formData.departureDate) <= new Date(formData.arrivalDate)) {
        newErrors.departureDate = "La fecha de salida debe ser posterior a la de llegada"
      }
    }

    if (formData.adults < 1) {
      newErrors.adults = "Debe haber al menos 1 adulto"
    }

    if (formData.kids < 0) {
      newErrors.kids = "El número de niños no puede ser negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAirportSearch = (value: string) => {
    setAirportSearch(value)
    if (value.trim()) {
      setFilteredAirports(filterAirports(value))
    } else {
      setFilteredAirports(airports.slice(0, 10))
    }
  }

  const selectAirport = (airport: Airport) => {
    setFormData((prev) => ({
      ...prev,
      departureAirport: airport.name,
      departureAirportCode: airport.code,
    }))
    setAirportSearch("")
    setShowAirportDropdown(false)
    setCustomAirport("")
    // Clear error
    if (errors.departureAirport) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.departureAirport
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSubmitError(null)
    try {
      // Determine final airport values
      const finalAirportName = customAirport || formData.departureAirport
      const finalAirportCode = customAirport ? "" : formData.departureAirportCode

      // Insert data into Supabase "leads" table
      const { data, error } = await supabase
        .from("leads")
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            destination: formData.destination,
            aeropuerto_salida: finalAirportName,
            aeropuerto_codigo: finalAirportCode,
            arrival_date: formData.arrivalDate,
            departure_date: formData.departureDate,
            adults: formData.adults,
            kids: formData.kids,
            message: formData.message,
            accept_promos: formData.acceptPromos,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        throw error
      }

      console.log("[v0] Reserva guardada en Supabase:", data)

      setIsSubmitted(true)

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al enviar la reserva. Intenta de nuevo."
      console.error("[v0] Error al guardar reserva:", error)
      setSubmitError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      destination: "punta-cana",
      departureAirport: "",
      departureAirportCode: "",
      arrivalDate: "",
      departureDate: "",
      adults: 1,
      kids: 0,
      message: "",
      acceptPromos: false,
    })
    setErrors({})
    setIsSubmitted(false)
    setSubmitError(null)
    setAirportSearch("")
    setShowAirportDropdown(false)
    setCustomAirport("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
          <h2 id="reservation-title" className="text-2xl font-bold text-foreground font-display">
            Reserva Tu Getaway
          </h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3 animate-fade-in-up">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground font-display">¡Reserva Confirmada!</h3>
              <p className="text-sm text-gray-600">
                Hemos recibido tu reserva. Te enviaremos un correo de confirmación en breve.
              </p>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-foreground mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.fullName ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Juan Pérez"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="juan@ejemplo.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.phone ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="+1 (555) 123-4567"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold text-foreground mb-2">
                  Destino
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  <option value="punta-cana">Punta Cana, República Dominicana</option>
                  <option value="riviera-maya">Riviera Maya, México</option>
                </select>
              </div>

              {/* Departure Airport */}
              <div>
                <label htmlFor="departureAirport" className="block text-sm font-semibold text-foreground mb-2">
                  Aeropuerto de Salida *
                </label>
                <div className="relative">
                  <div className={`relative px-4 py-3 border rounded-lg bg-gray-50 flex items-center ${
                    errors.departureAirport ? "border-red-500" : "border-gray-200"
                  }`}>
                    <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      id="departureAirport"
                      placeholder="Buscar aeropuerto..."
                      value={airportSearch || formData.departureAirport}
                      onChange={(e) => handleAirportSearch(e.target.value)}
                      onFocus={() => {
                        setShowAirportDropdown(true)
                        if (!airportSearch && !formData.departureAirport) {
                          setFilteredAirports(airports.slice(0, 10))
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowAirportDropdown(false), 200)}
                      className="w-full bg-transparent outline-none text-sm"
                      aria-invalid={!!errors.departureAirport}
                      aria-describedby={errors.departureAirport ? "departureAirport-error" : undefined}
                    />
                  </div>

                  {/* Dropdown */}
                  {showAirportDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {filteredAirports.length > 0 ? (
                        <>
                          {filteredAirports.map((airport) => (
                            <button
                              key={`${airport.code}-${airport.name}`}
                              type="button"
                              onClick={() => selectAirport(airport)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">{airport.name}</p>
                                  <p className="text-xs text-gray-500">{airport.region}</p>
                                </div>
                                <span className="text-xs font-bold text-[#FF6B00] ml-2 shrink-0">{airport.code}</span>
                              </div>
                            </button>
                          ))}
                          <div className="border-t border-gray-200 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAirportDropdown(false)
                                setCustomAirport(airportSearch)
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-600"
                            >
                              📝 Especificar otro: "{airportSearch}"
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No hay aeropuertos que coincidan
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Display selected airport or custom */}
                {(formData.departureAirport || customAirport) && (
                  <p className="text-xs text-gray-600 mt-2">
                    ✓ Seleccionado: {customAirport || `${formData.departureAirport} (${formData.departureAirportCode})`}
                  </p>
                )}

                {errors.departureAirport && (
                  <p id="departureAirport-error" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.departureAirport}
                  </p>
                )}
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="arrivalDate" className="block text-sm font-semibold text-foreground mb-2">
                    Llegada *
                  </label>
                  <input
                    type="date"
                    id="arrivalDate"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.arrivalDate ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                    aria-invalid={!!errors.arrivalDate}
                    aria-describedby={errors.arrivalDate ? "arrivalDate-error" : undefined}
                  />
                  {errors.arrivalDate && (
                    <p id="arrivalDate-error" className="text-red-600 text-xs mt-1 font-medium">
                      {errors.arrivalDate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="departureDate" className="block text-sm font-semibold text-foreground mb-2">
                    Salida *
                  </label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.departureDate ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                    aria-invalid={!!errors.departureDate}
                    aria-describedby={errors.departureDate ? "departureDate-error" : undefined}
                  />
                  {errors.departureDate && (
                    <p id="departureDate-error" className="text-red-600 text-xs mt-1 font-medium">
                      {errors.departureDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Guests Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adults" className="block text-sm font-semibold text-foreground mb-2">
                    Adultos *
                  </label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.adults ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                    aria-invalid={!!errors.adults}
                    aria-describedby={errors.adults ? "adults-error" : undefined}
                  />
                  {errors.adults && (
                    <p id="adults-error" className="text-red-600 text-xs mt-1 font-medium">
                      {errors.adults}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="kids" className="block text-sm font-semibold text-foreground mb-2">
                    Niños
                  </label>
                  <input
                    type="number"
                    id="kids"
                    name="kids"
                    min="0"
                    value={formData.kids}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.kids ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                    aria-invalid={!!errors.kids}
                    aria-describedby={errors.kids ? "kids-error" : undefined}
                  />
                  {errors.kids && (
                    <p id="kids-error" className="text-red-600 text-xs mt-1 font-medium">
                      {errors.kids}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Requisitos Especiales (Opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                  placeholder="Cuéntanos cualquier solicitud especial (habitación con vista, requisitos dietéticos, etc.)"
                />
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="acceptPromos"
                  checked={formData.acceptPromos}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  Acepto recibir ofertas, promociones y actualizaciones de Nick Resorts por correo electrónico
                </span>
              </label>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium animate-fade-in-up">
                  {submitError}
                </div>
              )}

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {errors.submit}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#F47B20] text-white font-semibold rounded-lg hover:bg-[#E36A0F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47B20]"
                >
                  {isLoading ? "Enviando..." : "ENVIAR RESERVA"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
