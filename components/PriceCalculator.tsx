"use client"

import { useEffect, useState } from "react"

const ROOMS = {
  presidential: { name: 'Suite Presidencial Nick', price: 599, capacity: '4+2' },
  spongebob: { name: 'Suite Familiar SpongeBob', price: 399, capacity: '4+2' },
  'paw-patrol': { name: 'Suite Deluxe PAW Patrol', price: 329, capacity: '3+2' },
  'ocean-view': { name: 'Junior Suite Ocean View', price: 249, capacity: '2+1' },
}

const PACKAGES = {
  'todo-incluido': { name: 'Todo Incluido Plus', price: 2499, nights: 7 },
  familiar: { name: 'Pack Familiar Aventura', price: 3299, nights: 7 },
  'luna-miel': { name: 'Luna de Miel', price: 2899, nights: 5 },
  slime: { name: 'Pack Slime Extreme', price: 1899, nights: 5 },
}

interface PriceCalculatorProps {
  selectedRoom?: string
  selectedPackage?: string
  nights?: number
  adults?: number
  kids?: number
  payWithCrypto?: boolean
  onPriceChange?: (total: number, breakdown: any) => void
  onCalculatorChange?: (data: {
    room: string
    package: string
    nights: number
    adults: number
    kids: number
    payWithCrypto: boolean
  }) => void
}

export function PriceCalculator({
  selectedRoom = 'presidential',
  selectedPackage = '',
  nights = 7,
  adults = 2,
  kids = 0,
  payWithCrypto = false,
  onPriceChange,
  onCalculatorChange,
}: PriceCalculatorProps) {
  const [room, setRoom] = useState(selectedRoom)
  const [packageId, setPackageId] = useState(selectedPackage)
  const [nightsCount, setNightsCount] = useState(nights)
  const [adultsCount, setAdultsCount] = useState(adults)
  const [kidsCount, setKidsCount] = useState(kids)
  const [cryptoPayment, setCryptoPayment] = useState(payWithCrypto)

  useEffect(() => {
    setRoom(selectedRoom)
    setPackageId(selectedPackage)
    setNightsCount(nights)
    setAdultsCount(adults)
    setKidsCount(kids)
    setCryptoPayment(payWithCrypto)
  }, [selectedRoom, selectedPackage, nights, adults, kids, payWithCrypto])

  const roomData = ROOMS[room as keyof typeof ROOMS]
  const packageData = packageId ? PACKAGES[packageId as keyof typeof PACKAGES] : null

  const roomTotal = roomData.price * nightsCount
  const packageTotal = packageData ? packageData.price : 0
  const subtotal = roomTotal + packageTotal
  const discount = cryptoPayment ? Math.round(subtotal * 0.2) : 0
  const total = subtotal - discount

  const breakdown = {
    room: {
      name: roomData.name,
      pricePerNight: roomData.price,
      nights: nightsCount,
      total: roomTotal,
    },
    package: packageData
      ? {
          name: packageData.name,
          price: packageData.price,
          nights: packageData.nights,
        }
      : null,
    subtotal,
    discount,
    total,
  }

  useEffect(() => {
    onCalculatorChange?.({
      room,
      package: packageId,
      nights: nightsCount,
      adults: adultsCount,
      kids: kidsCount,
      payWithCrypto: cryptoPayment,
    })

    if (onPriceChange) {
      onPriceChange(total, breakdown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, packageId, nightsCount, adultsCount, kidsCount, cryptoPayment])

  // Función para toggle de crypto con logs
  const handleCryptoToggle = () => {
    console.log('🔄 Toggle clickeado, estado actual:', cryptoPayment)
    setCryptoPayment(!cryptoPayment)
    console.log('🔄 Nuevo estado:', !cryptoPayment)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Seleccionar Habitación</label>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(ROOMS).map(([id, data]) => (
            <label
              key={id}
              className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                room === id
                  ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                  : 'border-gray-200 hover:border-[#FF6B00]/50'
              }`}
            >
              <input
                type="radio"
                name="room"
                value={id}
                checked={room === id}
                onChange={(e) => setRoom(e.target.value)}
                className="sr-only"
              />
              <div>
                <h3 className="font-bold text-foreground">{data.name}</h3>
                <p className="text-sm text-gray-600">Capacidad: {data.capacity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#FF6B00]">${data.price.toLocaleString()}/noche</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Paquete Especial (Opcional)</label>
        <div className="grid grid-cols-1 gap-3">
          <label
            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
              packageId === ''
                ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                : 'border-gray-200 hover:border-[#FF6B00]/50'
            }`}
          >
            <input
              type="radio"
              name="package"
              value=""
              checked={packageId === ''}
              onChange={() => setPackageId('')}
              className="sr-only"
            />
            <div>
              <h3 className="font-bold text-foreground">Sin paquete</h3>
              <p className="text-sm text-gray-600">Solo habitación</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-500">$0</p>
            </div>
          </label>

          {Object.entries(PACKAGES).map(([id, data]) => (
            <label
              key={id}
              className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                packageId === id
                  ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                  : 'border-gray-200 hover:border-[#FF6B00]/50'
              }`}
            >
              <input
                type="radio"
                name="package"
                value={id}
                checked={packageId === id}
                onChange={(e) => setPackageId(e.target.value)}
                className="sr-only"
              />
              <div>
                <h3 className="font-bold text-foreground">{data.name}</h3>
                <p className="text-sm text-gray-600">{data.nights} noches incluidas</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#FF6B00]">${data.price.toLocaleString()}</p>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/paquetes'
            }
          }}
          className="text-sm text-[#FF6B00] font-semibold hover:underline mt-2"
        >
          📦 Ver más opciones de paquetes →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Noches</label>
          <input
            type="number"
            min="1"
            max="14"
            value={nightsCount}
            onChange={(e) => setNightsCount(Math.min(14, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors text-center font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Adultos</label>
          <input
            type="number"
            min="1"
            max="8"
            value={adultsCount}
            onChange={(e) => setAdultsCount(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors text-center font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Niños</label>
          <input
            type="number"
            min="0"
            max="6"
            value={kidsCount}
            onChange={(e) => setKidsCount(Math.min(6, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors text-center font-medium"
          />
        </div>
      </div>

      {/* 🪙 SECCIÓN DE CRIPTOMONEDAS CON LOGOS REALES - TOGGLE FUNCIONAL */}
      <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B00]/20 border border-[#FFD700]/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-foreground flex items-center gap-2">
              🪙 Pagar con Criptomonedas
            </p>
            <p className="text-xs text-gray-600">20% de descuento en todo</p>
          </div>
          <button
            type="button"
            onClick={handleCryptoToggle}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
              cryptoPayment ? 'bg-[#FF6B00]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                cryptoPayment ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Logos reales de criptomonedas */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <img src="/crypto-logos/bitcoin.png" alt="Bitcoin" className="w-6 h-6 object-contain" />
            <span className="text-xs font-semibold text-gray-700">BTC</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <img src="/crypto-logos/usdt.png" alt="USDT" className="w-6 h-6 object-contain" />
            <span className="text-xs font-semibold text-gray-700">USDT</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <img src="/crypto-logos/eth.png" alt="Ethereum" className="w-6 h-6 object-contain" />
            <span className="text-xs font-semibold text-gray-700">ETH</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <img src="/crypto-logos/bnb.png" alt="BNB" className="w-6 h-6 object-contain" />
            <span className="text-xs font-semibold text-gray-700">BNB</span>
          </div>
        </div>

        {/* Badge de descuento animado */}
        {cryptoPayment && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1a1a1a] text-xs font-bold animate-pulse">
            🔥 20% DESCUENTO ACTIVADO
          </div>
        )}
      </div>

      <div className={`border-2 rounded-xl p-6 transition-all duration-300 ${
        cryptoPayment ? 'border-[#3DB54A] bg-[#3DB54A]/5' : 'border-[#FF6B00] bg-[#FF6B00]/5'
      }`}>
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">Resumen de Costos</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Habitación ({roomData.name})</span>
            <span>${roomData.price} × {nightsCount} = ${roomTotal.toLocaleString()}</span>
          </div>

          {packageData && (
            <div className="flex justify-between">
              <span>Paquete ({packageData.name})</span>
              <span>${packageData.price.toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>

          {cryptoPayment && (
            <div className="flex justify-between text-[#3DB54A] font-medium">
              <span>💰 Descuento Cripto (20%)</span>
              <span>-${discount.toLocaleString()}</span>
            </div>
          )}

          <div className={`border-t border-gray-300 pt-2 flex justify-between text-xl font-black ${
            cryptoPayment ? 'text-[#3DB54A]' : 'text-[#FF6B00]'
          }`}>
            <span>Total a Pagar</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}