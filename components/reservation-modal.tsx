"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Search, CheckCircle } from "lucide-react"
import { airports, filterAirports, type Airport } from "@/lib/airports"
import { PriceCalculator } from "./PriceCalculator"
import { PaymentModal } from "./PaymentModal"
import { saveCart, loadCart, clearCart, updateCartStatus, type CartItem } from "@/lib/cart"

const ROOM_LABELS: Record<string, string> = {
  presidential: 'Suite Presidencial Nick',
  spongebob: 'Suite Familiar SpongeBob',
  'paw-patrol': 'Suite Deluxe PAW Patrol',
  'ocean-view': 'Junior Suite Ocean View',
}

const PACKAGE_LABELS: Record<string, string> = {
  'todo-incluido': 'Todo Incluido Plus',
  familiar: 'Pack Familiar Aventura',
  'luna-miel': 'Luna de Miel',
  slime: 'Pack Slime Extreme',
}

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedPackage?: string
  preselectedRoom?: string
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
  message: string
  acceptPromos: boolean
}

interface CalculatorData {
  room: string
  package: string
  nights: number
  adults: number
  kids: number
  payWithCrypto: boolean
}

interface FormErrors {
  [key: string]: string
}

type Step = 'form' | 'confirmation'

export function ReservationModal({ isOpen, onClose, preselectedPackage = '', preselectedRoom = 'presidential' }: ReservationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('form')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'crypto'>('card')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [cartLoaded, setCartLoaded] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    destination: "punta-cana",
    departureAirport: "",
    departureAirportCode: "",
    arrivalDate: "",
    departureDate: "",
    message: "",
    acceptPromos: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [airportSearch, setAirportSearch] = useState("")
  const [showAirportDropdown, setShowAirportDropdown] = useState(false)
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [customAirport, setCustomAirport] = useState("")

  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    room: preselectedRoom,
    package: preselectedPackage,
    nights: 7,
    adults: 2,
    kids: 0,
    payWithCrypto: false,
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('form')
      setLeadId(null)
      setSelectedPaymentMethod('card')
      setShowPaymentModal(false)
      setIsLoading(false)
      setSubmitError(null)
      setErrors({})
      setAirportSearch("")
      setShowAirportDropdown(false)
      setCustomAirport("")
      setCalculatorData({
        room: preselectedRoom || 'presidential',
        package: preselectedPackage || '',
        nights: 7,
        adults: 2,
        kids: 0,
        payWithCrypto: false,
      })
      setTotalPrice(0)
      setPriceBreakdown(null)
    }
  }, [isOpen, preselectedPackage, preselectedRoom])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  // Cargar carrito cuando se abre el modal
  useEffect(() => {
    if (isOpen && !cartLoaded) {
      // Primero intentar restaurar estado guardado
      const savedState = localStorage.getItem('nick_reservation_modal_state')
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          setFormData(state.formData)
          setCalculatorData(state.calculatorData)
          setTotalPrice(state.totalPrice)
          setPriceBreakdown(state.priceBreakdown)
          setCurrentStep(state.currentStep)
          setLeadId(state.leadId)
          localStorage.removeItem('nick_reservation_modal_state')
          setCartLoaded(true)
        } catch (error) {
          console.error('Error restaurando estado del modal:', error)
        }
      } else {
        const cart = loadCart()
        if (cart && cart.status === 'pending') {
          // Restaurar datos del carrito
          setFormData({
            fullName: cart.formData.fullName,
            email: cart.formData.email,
            phone: cart.formData.phone,
            destination: cart.formData.destination,
            departureAirport: cart.formData.aeropuertoSalida,
            departureAirportCode: "",
            arrivalDate: cart.formData.arrivalDate,
            departureDate: cart.formData.departureDate,
            message: "",
            acceptPromos: false,
          })
          setCalculatorData({
            room: cart.roomId,
            package: cart.packageId,
            nights: cart.nights,
            adults: cart.adults,
            kids: cart.kids,
            payWithCrypto: false,
          })
          setLeadId(cart.leadId)
          setCurrentStep('confirmation')
          setTotalPrice(cart.totalPrice)
          setPriceBreakdown(cart.priceBreakdown)
        }
        setCartLoaded(true)
      }
    }
  }, [isOpen, cartLoaded])

  // Reiniciar cartLoaded cuando se recarga la página
  useEffect(() => {
    const handlePageLoad = () => {
      setCartLoaded(false)
    }
    window.addEventListener('load', handlePageLoad)
    return () => window.removeEventListener('load', handlePageLoad)
  }, [])

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
    if (errors.departureAirport) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.departureAirport
        return newErrors
      })
    }
  }

  const handleCalculatorChange = (data: CalculatorData) => {
    setCalculatorData(data)
  }

  const handlePriceChange = (total: number, breakdown: any) => {
    setTotalPrice(total)
    setPriceBreakdown(breakdown)
  }

  const getPackageLabel = (pkg: string) => {
    if (!pkg) {
      return 'Sin paquete'
    }
    return PACKAGE_LABELS[pkg] || 'Paquete personalizado'
  }

  const getRoomLabel = (room: string) => {
    return ROOM_LABELS[room] || 'Habitación personalizada'
  }

  // ============================================
  // 📧 FUNCIÓN PARA ENVIAR CORREO DE CONFIRMACIÓN
  // ============================================
  const sendReservationEmail = async (lead: any, cart: CartItem) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, cart }),
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('📧 Correo enviado exitosamente');
      } else {
        console.error('❌ Error enviando correo:', data.error);
      }
    } catch (error) {
      console.error('❌ Error en la petición de correo:', error);
    }
  };

  const saveLead = async () => {
    const finalAirportName = customAirport || formData.departureAirport
    const finalAirportCode = customAirport ? "" : formData.departureAirportCode

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      destination: formData.destination,
      aeropuerto_salida: finalAirportName,
      aeropuerto_codigo: finalAirportCode,
      arrival_date: formData.arrivalDate,
      departure_date: formData.departureDate,
      adults: calculatorData.adults,
      kids: calculatorData.kids,
      message: formData.message,
      accept_promos: formData.acceptPromos,
      selected_room: calculatorData.room,
      selected_package: calculatorData.package,
      nights: calculatorData.nights,
      total_price: totalPrice,
      payment_method: calculatorData.payWithCrypto ? 'crypto' : 'card',
      price_breakdown: JSON.stringify(priceBreakdown),
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Error al guardar la reserva.')
    }

    return data
  }

  const handleSubmitLead = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSubmitError(null)

    try {
      const savedLead = await saveLead()
      setLeadId(savedLead.id || savedLead[0]?.id)
      setCurrentStep('confirmation')
      setSelectedPaymentMethod(calculatorData.payWithCrypto ? 'crypto' : 'card')

      // Guardar en carrito
      const cartItem: CartItem = {
        leadId: savedLead.id || savedLead[0]?.id,
        roomId: calculatorData.room,
        roomName: getRoomLabel(calculatorData.room),
        packageId: calculatorData.package,
        packageName: getPackageLabel(calculatorData.package),
        nights: calculatorData.nights,
        adults: calculatorData.adults,
        kids: calculatorData.kids,
        totalPrice: totalPrice,
        priceBreakdown: priceBreakdown,
        formData: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          aeropuertoSalida: formData.departureAirport,
          arrivalDate: formData.arrivalDate,
          departureDate: formData.departureDate,
        },
        createdAt: new Date().toISOString(),
        status: 'pending',
      }
      saveCart(cartItem)

      // 📧 Enviar correo de confirmación
      await sendReservationEmail(savedLead, cartItem)

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al guardar la reserva. Intenta de nuevo.'
      console.error('[v0] Error al guardar lead:', error)
      setSubmitError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setCurrentStep('form')
  }

  const handleOpenPayment = () => {
    setSelectedPaymentMethod(calculatorData.payWithCrypto ? 'crypto' : 'card')
    setShowPaymentModal(true)
  }

  const handleBackFromPayment = () => {
    setShowPaymentModal(false)
    setCurrentStep('confirmation')
  }

  const handlePaymentComplete = () => {
    updateCartStatus('completed')
    clearCart()
    alert('¡Pago procesado! Tu reserva está confirmada.')
    handleClose()
  }

  const openVirtualOffice = () => {
    console.log('👤 Abriendo oficina virtual...')

    if (leadId) {
      localStorage.setItem('nick_chat_lead_id', leadId)
      localStorage.setItem('nick_chat_conversation_id', leadId)
    }
    if (formData.email) {
      localStorage.setItem('nick_chat_user_email', formData.email)
      localStorage.setItem('nick_chat_user_name', formData.fullName)
    }

    // 1. Cerrar el modal
    onClose()

    // 2. Esperar 500ms y luego usar la función GLOBAL directa
    setTimeout(() => {
      console.log('📱 Intentando abrir chat...')
      
      if (typeof window !== 'undefined') {
        if ((window as any).openNickChat) {
          console.log('✅ openNickChat existe, llamando...')
          ;(window as any).openNickChat()
        } else {
          console.log('⚠️ openNickChat no existe, creando función de respaldo...')
          ;(window as any).openNickChat = () => {
            console.log('📱 openNickChat (respaldo) fue llamado')
            const chatBtn = document.querySelector('.fixed\\.bottom-4 button, .fixed\\.bottom-6 button, .z-50 button')
            if (chatBtn) {
              console.log('✅ Botón de chat encontrado, haciendo clic...')
              ;(chatBtn as HTMLElement).click()
            } else {
              console.error('❌ No se encontró el botón del chat')
              window.dispatchEvent(new CustomEvent('openChatWidget'))
            }
          }
          ;(window as any).openNickChat()
        }
      }
    }, 500)
  }

  // 🔥 FUNCIÓN PARA TELEGRAM
  const openTelegram = () => {
    if (typeof window !== 'undefined') {
      window.open('https://t.me/NickResortOficial', '_blank')
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
      message: "",
      acceptPromos: false,
    })
    setErrors({})
    setSubmitError(null)
    setAirportSearch("")
    setShowAirportDropdown(false)
    setCustomAirport("")
    setCurrentStep('form')
    setSelectedPaymentMethod('card')
    setShowPaymentModal(false)
    setCalculatorData({
      room: preselectedRoom,
      package: preselectedPackage,
      nights: 7,
      adults: 2,
      kids: 0,
      payWithCrypto: false,
    })
    setTotalPrice(0)
    setPriceBreakdown(null)
    setLeadId(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
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
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
            <h2 id="reservation-title" className="text-2xl font-bold text-foreground font-display">
              {currentStep === 'form' ? 'Reserva Tu Getaway' : 'Confirmación de Reserva'}
            </h2>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {currentStep === 'form' ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">📋 Datos Personales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
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
                          errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        placeholder="Juan Pérez"
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      />
                      {errors.fullName && (
                        <p id="fullName-error" className="text-red-600 text-xs mt-1 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

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
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        placeholder="juan@ejemplo.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-600 text-xs mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>

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
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        placeholder="+1 (555) 123-4567"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-red-600 text-xs mt-1 font-medium">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="departureAirport" className="block text-sm font-semibold text-foreground mb-2">
                        Aeropuerto de Salida *
                      </label>
                      <div className="relative">
                        <div className={`relative px-4 py-3 border rounded-lg bg-gray-50 flex items-center ${
                          errors.departureAirport ? 'border-red-500' : 'border-gray-200'
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
                            aria-describedby={errors.departureAirport ? 'departureAirport-error' : undefined}
                          />
                        </div>

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
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-foreground mb-4">🏖️ Paquetes y Habitaciones</h3>
                    <button
                      type="button"
                      onClick={() => {
                        // Guardar estado actual antes de navegar
                        const currentState = {
                          formData,
                          calculatorData,
                          totalPrice,
                          priceBreakdown,
                          currentStep,
                          leadId
                        }
                        localStorage.setItem('nick_reservation_modal_state', JSON.stringify(currentState))
                        onClose()
                        router.push('/paquetes')
                      }}
                      className="text-sm font-semibold text-[#FF6B00] hover:underline"
                    >
                      Ver paquetes
                    </button>
                  </div>
                  <PriceCalculator
                    selectedRoom={calculatorData.room}
                    selectedPackage={calculatorData.package}
                    nights={calculatorData.nights}
                    adults={calculatorData.adults}
                    kids={calculatorData.kids}
                    payWithCrypto={calculatorData.payWithCrypto}
                    onCalculatorChange={handleCalculatorChange}
                    onPriceChange={handlePriceChange}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">📅 Fechas de Viaje</h3>
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
                          errors.arrivalDate ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        aria-invalid={!!errors.arrivalDate}
                        aria-describedby={errors.arrivalDate ? 'arrivalDate-error' : undefined}
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
                          errors.departureDate ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        aria-invalid={!!errors.departureDate}
                        aria-describedby={errors.departureDate ? 'departureDate-error' : undefined}
                      />
                      {errors.departureDate && (
                        <p id="departureDate-error" className="text-red-600 text-xs mt-1 font-medium">
                          {errors.departureDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
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
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleSubmitLead}
                    disabled={isLoading}
                    className="bg-[#FF6B00] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#E55A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isLoading ? 'Guardando...' : 'ENVIAR RESERVA'}
                  </button>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600 font-medium">{submitError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¡Reserva Recibida!</h2>
                <p className="text-gray-600 mb-6">
                  Hemos recibido tu solicitud. El ID de tu reserva es: <strong>#{leadId}</strong>
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-bold mb-3">Resumen de tu reserva:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Paquete:</span>
                      <span className="font-semibold">{getPackageLabel(calculatorData.package)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitación:</span>
                      <span className="font-semibold">{getRoomLabel(calculatorData.room)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Noches:</span>
                      <span className="font-semibold">{calculatorData.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Huéspedes:</span>
                      <span className="font-semibold">{calculatorData.adults} adultos, {calculatorData.kids} niños</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-[#FF6B00]">
                      <span>Total:</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleOpenPayment}
                    className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    💳 Continuar con el pago
                  </button>

                  <button
                    onClick={() => {
                      onClose()
                      window.location.href = '/paquetes'
                    }}
                    className="mt-4 text-sm text-[#FF6B00] font-semibold hover:underline flex items-center gap-1"
                  >
                    📦 Ver más opciones de paquetes →
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={openVirtualOffice}
                      className="bg-[#3DB54A] text-white py-3 rounded-xl font-bold hover:bg-[#2D8A38] transition-colors"
                    >
                      👤 Oficina Virtual
                    </button>
                    <button
                      onClick={openTelegram}
                      className="bg-[#0088cc] text-white py-3 rounded-xl font-bold hover:bg-[#006699] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </button>
                  </div>

                  <button
                    onClick={handleEdit}
                    className="w-full py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    ✏️ Editar requerimiento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onBack={handleBackFromPayment}
        totalAmount={totalPrice}
        paymentMethod={selectedPaymentMethod}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  )
}