"use client"

import Link from "next/link"
import { Trash2, ArrowLeft, CreditCard, Smartphone, CheckCircle, Clock, MapPin, Users, Calendar, Bed, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

interface CartItem {
  leadId: string
  roomId: string
  roomName: string
  packageId: string
  packageName: string
  nights: number
  adults: number
  kids: number
  totalPrice: number
  priceBreakdown: any
  formData: {
    fullName: string
    email: string
    phone: string
    destination: string
    aeropuertoSalida: string
    arrivalDate: string
    departureDate: string
  }
  createdAt: string
  status: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedCart = localStorage.getItem("nick_resorts_cart")
    setCart(storedCart ? JSON.parse(storedCart) : null)
  }, [])

  const clearCart = () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("nick_resorts_cart")
    setCart(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B00] hover:text-[#e05a00] mb-2">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
            <h1 className="text-4xl font-black text-slate-900 font-display">Tu Carrito de Reserva</h1>
            <p className="text-slate-600 mt-2">Revisa y confirma los detalles de tu reserva</p>
          </div>
        </div>

        {cart ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Detalles de la Reserva */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estado de la Reserva */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#FF6B00] rounded-full">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Reserva Pendiente</h2>
                    <p className="text-sm text-slate-600">Creada el {formatDate(cart.createdAt)}</p>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Información Personal
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-slate-900">{cart.formData.fullName}</p>
                      <p className="text-slate-600">{cart.formData.email}</p>
                      <p className="text-slate-600">{cart.formData.phone}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Destino y Viaje
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-slate-900">Punta Cana, República Dominicana</p>
                      <p className="text-slate-600">Desde: {cart.formData.aeropuertoSalida || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fechas del Viaje
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-slate-600">Llegada</p>
                      <p className="font-medium text-slate-900">{formatDate(cart.formData.arrivalDate)}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Salida</p>
                      <p className="font-medium text-slate-900">{formatDate(cart.formData.departureDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles del Paquete */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Detalles de tu Reserva
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Paquete</p>
                    <p className="font-semibold text-slate-900">{cart.packageName || 'Sin paquete'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Habitación</p>
                    <p className="font-semibold text-slate-900">{cart.roomName || 'No seleccionada'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Noches</p>
                    <p className="font-semibold text-slate-900">{cart.nights || 0}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Huéspedes</p>
                    <p className="font-semibold text-slate-900">{cart.adults || 0} adultos, {cart.kids || 0} niños</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen y Acciones */}
            <div className="space-y-6">
              {/* Resumen de Precio */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Resumen de Precio</h2>

                {cart.priceBreakdown && Object.keys(cart.priceBreakdown).length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {Object.entries(cart.priceBreakdown).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">${(value ?? 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-4">No hay desglose de precio disponible</p>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-[#FF6B00]">
                      ${(cart.totalPrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">¿Qué deseas hacer?</h2>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      localStorage.setItem('nick_open_payment_modal', 'true')
                      window.location.href = '/'
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white hover:bg-[#e05a00] transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Continuar con el Pago
                  </button>

                  <Link
                    href="/paquetes"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                  >
                    <Bed className="w-4 h-4" />
                    Cambiar Paquete
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Carrito Vacío */
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              No tienes ninguna reserva pendiente. Explora nuestros paquetes y habitaciones para comenzar tu aventura.
            </p>
            <Link
              href="/paquetes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white hover:bg-[#e05a00] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Bed className="w-5 h-5" />
              Explorar Paquetes
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}