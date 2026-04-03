"use client"

import Image from "next/image"
import { useState } from "react"
import { Star, Users, Wind } from "lucide-react"
import { useModal } from "@/context/modal-context"

export default function PaquetesPage() {
  const { openModal } = useModal()

  const [calculator, setCalculator] = useState({
    room: "presidential",
    package: "",
    nights: 7,
    adults: 2,
    kids: 0,
    payWithCrypto: false,
  })

  const rooms = [
    {
      id: "presidential",
      name: "Suite Presidencial Nick",
      size: "120m²",
      capacity: "4 adultos + 2 niños",
      basePrice: 599,
      image: "/room-presidential.jpg",
      amenities: ["Jacuzzi privado", "Cocina completa", "Terraza", "Slime party privada"],
      description: "Suite de lujo con vista al mar y amenidades premium",
    },
    {
      id: "spongebob",
      name: "Suite Familiar SpongeBob",
      size: "85m²",
      capacity: "4 adultos + 2 niños",
      basePrice: 399,
      image: "/room-spongebob.jpg",
      amenities: ["Temática exclusiva", "Juegos interactivos", "Baño temático", "Smart TV"],
      description: "Habitación temática con experiencia interactiva de Bob Esponja",
    },
    {
      id: "paw-patrol",
      name: "Suite Deluxe PAW Patrol",
      size: "70m²",
      capacity: "3 adultos + 2 niños",
      basePrice: 329,
      image: "/room-paw-patrol.jpg",
      amenities: ["Zona de juegos", "Cama temática", "Decoración PAW Patrol", "Minibar"],
      description: "Suite aventurera con temática de PAW Patrol",
    },
    {
      id: "ocean-view",
      name: "Junior Suite Ocean View",
      size: "50m²",
      capacity: "2 adultos + 1 niño",
      basePrice: 249,
      image: "/room-ocean-view.jpg",
      amenities: ["Balcón con vista al mar", "Minibar premium", "Aire acondicionado", "Safe"],
      description: "Elegante suite con hermosa vista al océano",
    },
  ]

  const packages = [
    {
      id: "todo-incluido",
      name: "Todo Incluido Plus",
      price: 2499,
      nights: 7,
      pricePerNight: 357,
      image: "/package-spa.jpg",
      benefits: ["Habitación Deluxe", "Spa incluido", "Excursión a Isla Saona", "Bebidas premium"],
    },
    {
      id: "familiar",
      name: "Pack Familiar Aventura",
      price: 3299,
      nights: 7,
      pricePerNight: 471,
      image: "/package-family.jpg",
      benefits: ["Suite familiar", "Meet & Greet con personajes", "Pase parque acuático", "Actividades diarias"],
    },
    {
      id: "luna-miel",
      name: "Luna de Miel",
      price: 2899,
      nights: 5,
      pricePerNight: 580,
      image: "/package-honeymoon.jpg",
      benefits: ["Suite Presidencial", "Cena romántica en playa", "Masaje para parejas", "Champagne"],
    },
    {
      id: "slime",
      name: "Pack Slime Extreme",
      price: 1899,
      nights: 5,
      pricePerNight: 380,
      image: "/package-slime.jpg",
      benefits: ["Experiencia slime diaria", "Camiseta exclusiva", "Fiesta slime familiar", "Kit DIY"],
    },
  ]

  const roomData = rooms.find((r) => r.id === calculator.room)
  const selectedPackage = packages.find((p) => p.id === calculator.package)
  const nightPrice = roomData?.basePrice || 0
  const packagePrice = selectedPackage?.price || 0
  let totalPrice = nightPrice * calculator.nights + packagePrice
  
  const cryptoDiscount = calculator.payWithCrypto ? 0.2 : 0
  const finalPrice = totalPrice * (1 - cryptoDiscount)
  const discountAmount = totalPrice - finalPrice

  const getDiscountedPrice = (originalPrice: number) => {
    return Math.round(originalPrice * 0.8)
  }

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-[#FF6B00]/20 to-[#3DB54A]/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-display">
            Habitaciones y Paquetes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Elige el alojamiento perfecto y personaliza tu experiencia Nick Resorts
          </p>
        </div>
      </section>

      {/* Crypto Banner con logos */}
      <section className="py-4 px-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B00]/20 border-y border-[#FFD700]/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[#FF6B00]/10 px-4 py-2 rounded-full">
              {/* Logos de criptomonedas */}
              <div className="flex items-center gap-1">
                <div className="relative w-5 h-5">
                  <Image
                    src="/crypto-logos/bitcoin.png"
                    alt="Bitcoin"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-5 h-5">
                  <Image
                    src="/crypto-logos/usdt.png"
                    alt="USDT"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-gray-500 ml-1">+ más</span>
              </div>
              <span className="font-bold text-foreground">🔥 OFERTA ESPECIAL 🔥</span>
            </div>
            <p className="text-foreground font-semibold">
              ¡<span className="text-[#FF6B00] text-xl font-black">20% DESCUENTO</span> pagando con 
              <span className="font-bold text-[#FFD700] ml-1">CRIPTOMONEDAS</span>!
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-foreground mb-12 text-center font-display">
            Habitaciones Elegantes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#FF6B00] text-white px-4 py-2 rounded-full font-bold text-sm">
                    ${room.basePrice}/noche
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#FFD700] text-[#1a1a1a] px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
                    <div className="relative w-3 h-3">
                      <Image
                        src="/crypto-logos/bitcoin.png"
                        alt="Bitcoin"
                        fill
                        className="object-contain"
                      />
                    </div>
                    20% OFF con cripto
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 font-display">{room.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{room.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="w-4 h-4 text-[#FF6B00]" />
                      <span className="text-gray-700">{room.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#FF6B00]" />
                      <span className="text-gray-700">{room.capacity}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-600 mb-2">AMENIDADES:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span key={amenity} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 text-center">
                    <p className="text-xs text-gray-500 line-through">${room.basePrice}/noche</p>
                    <p className="text-lg font-bold text-[#3DB54A]">${getDiscountedPrice(room.basePrice)}/noche con cripto</p>
                  </div>

                  <button
                    onClick={openModal}
                    className="w-full bg-[#FF6B00] text-white font-bold py-3 rounded-lg hover:bg-[#E55A00] transition-colors duration-200"
                  >
                    RESERVAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#3DB54A]/10 to-[#FF6B00]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-foreground mb-12 text-center font-display">
            Paquetes Especiales
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {packages.map((pkg) => {
              const discountedPrice = getDiscountedPrice(pkg.price)
              return (
                <div
                  key={pkg.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-[#FF6B00]/20 relative"
                >
                  <div className="absolute top-4 left-4 z-10 bg-[#FFD700] text-[#1a1a1a] px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
                    <div className="relative w-3 h-3">
                      <Image
                        src="/crypto-logos/bitcoin.png"
                        alt="Bitcoin"
                        fill
                        className="object-contain"
                      />
                    </div>
                    20% OFF con cripto
                  </div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-2xl font-bold text-white font-display">{pkg.name}</h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <p className="text-gray-300 line-through text-sm">${pkg.price}</p>
                          <p className="text-[#FFD700] font-bold text-2xl">${discountedPrice}</p>
                          <p className="text-white/80 text-sm">{pkg.nights} noches</p>
                          <p className="text-white/60 text-xs">(${getDiscountedPrice(pkg.pricePerNight)}/noche)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-600 mb-3">BENEFICIOS INCLUIDOS:</p>
                      <ul className="space-y-2">
                        {pkg.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
                            <Star className="w-4 h-4 text-[#FF6B00] mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={openModal}
                      className="w-full bg-[#FF6B00] text-white font-bold py-3 rounded-lg hover:bg-[#E55A00] transition-colors duration-200"
                    >
                      RESERVAR PAQUETE
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center font-display">
            Calculadora de Presupuesto
          </h2>
          <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#3DB54A]/10 p-8 rounded-2xl">
            <div className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Seleccionar Habitación</label>
                <select
                  value={calculator.room}
                  onChange={(e) => setCalculator({ ...calculator, room: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-foreground font-medium"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (${r.basePrice}/noche)
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Paquete Especial (Opcional)</label>
                <select
                  value={calculator.package}
                  onChange={(e) => setCalculator({ ...calculator, package: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-foreground font-medium"
                >
                  <option value="">Sin paquete</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price} ({p.nights} noches) → ${getDiscountedPrice(p.price)} con cripto
                    </option>
                  ))}
                </select>
              </div>

              {/* Night, Adults, Kids */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Noches</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={calculator.nights}
                    onChange={(e) => setCalculator({ ...calculator, nights: Math.min(14, Math.max(1, parseInt(e.target.value) || 1)) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-foreground font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Adultos</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={calculator.adults}
                    onChange={(e) => setCalculator({ ...calculator, adults: Math.min(8, Math.max(1, parseInt(e.target.value) || 1)) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-foreground font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Niños</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={calculator.kids}
                    onChange={(e) => setCalculator({ ...calculator, kids: Math.min(6, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-foreground font-medium text-center"
                  />
                </div>
              </div>

              {/* Crypto Payment Toggle con logos */}
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/crypto-logos/bitcoin.png"
                          alt="Bitcoin"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="relative w-6 h-6">
                        <Image
                          src="/crypto-logos/usdt.png"
                          alt="USDT"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Pagar con Criptomonedas</p>
                      <p className="text-xs text-gray-500">Bitcoin, USDT, Ethereum y más</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={calculator.payWithCrypto}
                      onChange={(e) => setCalculator({ ...calculator, payWithCrypto: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF6B00] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </div>
                </label>
                {calculator.payWithCrypto && (
                  <p className="text-xs text-[#3DB54A] font-medium mt-3 animate-pulse">
                    🎉 ¡20% de descuento aplicado! Ahorras ${discountAmount.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Price Display */}
              <div className={`border-2 rounded-xl p-6 text-center transition-all duration-300 ${calculator.payWithCrypto ? 'border-[#3DB54A] bg-[#3DB54A]/5' : 'border-[#FF6B00]'}`}>
                <p className="text-gray-600 text-sm mb-2">
                  {calculator.payWithCrypto ? 'Precio con DESCUENTO CRIPTO (20% OFF)' : 'Precio Total Estimado'}
                </p>
                {calculator.payWithCrypto && (
                  <p className="text-gray-400 line-through text-sm">${totalPrice.toLocaleString()}</p>
                )}
                <p className={`text-4xl font-black font-display ${calculator.payWithCrypto ? 'text-[#3DB54A]' : 'text-[#FF6B00]'}`}>
                  ${finalPrice.toLocaleString()}
                </p>
                {calculator.payWithCrypto && (
                  <p className="text-xs text-[#3DB54A] font-medium mt-1">
                    ✨ Ahorro de ${discountAmount.toLocaleString()} ✨
                  </p>
                )}
                <p className="text-gray-600 text-xs mt-2">
                  {roomData?.basePrice} x {calculator.nights} noches
                  {selectedPackage ? ` + ${selectedPackage.name} ($${selectedPackage.price})` : ""}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  *Impuestos no incluidos
                </p>
              </div>

              {/* Reserve Button */}
              <button
                onClick={openModal}
                className="w-full bg-[#FF6B00] text-white font-bold py-4 rounded-lg hover:bg-[#E55A00] transition-colors duration-200 text-lg"
              >
                {calculator.payWithCrypto ? '💰 RESERVAR CON CRIPTO (20% OFF) 💰' : 'Solicitar Reserva'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}