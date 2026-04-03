"use client"

import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import { Clock, Star, Users, Heart, Sparkles, ChevronRight } from "lucide-react"
import { useModal } from "@/context/modal-context"

const offers = [
  {
    id: "family",
    image: "/offer-family.jpg",
    alt: "Familia disfrutando el parque acuático del resort",
    badge: "Por tiempo limitado",
    tag: "Familias",
    tagIcon: Users,
    tagColor: "text-[#FF6B00]",
    tagBg: "bg-orange-50",
    title: "Escapa en Familia",
    discount: "20% OFF",
    discountSub: "en tu reserva total",
    highlight: "Slime Experience gratis para los niños",
    highlightIcon: Sparkles,
    highlightColor: "text-[#3DB54A]",
    highlightBg: "bg-green-50",
    perks: [
      "Habitación familiar deluxe",
      "Todo incluido premium",
      "1 sesión de Slime Experience",
      "Encuentro con personajes Nickelodeon",
    ],
    price: "desde",
    amount: 1299,
    originalAmount: 1624,
    per: "/ 7 noches",
    accentFrom: "#FF6B00",
    accentTo: "#FF8C33",
  },
  {
    id: "honeymoon",
    image: "/offer-honeymoon.jpg",
    alt: "Suite romántica de luna de miel frente al mar",
    badge: "Por tiempo limitado",
    tag: "Parejas",
    tagIcon: Heart,
    tagColor: "text-rose-500",
    tagBg: "bg-rose-50",
    title: "Luna de Miel en Nick Resort",
    discount: "Suite de Lujo",
    discountSub: "incluida en tu paquete",
    highlight: "Cena romántica a la orilla del mar",
    highlightIcon: Star,
    highlightColor: "text-amber-500",
    highlightBg: "bg-amber-50",
    perks: [
      "Suite ocean-view con jacuzzi privado",
      "Cena gourmet para dos en la playa",
      "Servicio de mayordomo 24/7",
      "Spa & masajes incluidos",
    ],
    price: "desde",
    amount: 2499,
    originalAmount: 3124,
    per: "/ 7 noches",
    accentFrom: "#FF6B00",
    accentTo: "#FF8C33",
  },
]

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

function OfferCard({
  offer,
  delay,
  visible,
}: {
  offer: (typeof offers)[number]
  delay: number
  visible: boolean
}) {
  const TagIcon = offer.tagIcon
  const HighlightIcon = offer.highlightIcon
  const { openModal } = useModal()
  const [payWithCrypto, setPayWithCrypto] = useState(false)
  
  const discountedPrice = payWithCrypto ? Math.round(offer.amount * 0.8) : offer.amount
  const cryptoDiscount = payWithCrypto ? 20 : 0

  return (
    <article
      className={`
        group relative flex flex-col bg-white rounded-3xl overflow-hidden
        shadow-md hover:shadow-2xl hover:-translate-y-2
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      style={{ transitionDelay: `${delay}ms`, transitionProperty: "opacity, transform, box-shadow" }}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={offer.image}
          alt={offer.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* "Por tiempo limitado" badge — top-left */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#3DB54A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          <Clock className="w-3 h-3" aria-hidden="true" />
          {offer.badge}
        </div>

        {/* Discount pill — bottom-left over image */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-0.5">
          <span
            className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-lg"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            {offer.discount}
          </span>
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow">
            {offer.discountSub}
          </span>
        </div>

        {/* Crypto badge - top right con logos */}
        <div className="absolute top-4 right-4 bg-[#FFD700] text-[#1a1a1a] px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-md">
          <div className="relative w-3 h-3">
            <Image
              src="/crypto-logos/bitcoin.png"
              alt="Bitcoin"
              fill
              className="object-contain"
            />
          </div>
          <span>-20%</span>
          <div className="relative w-3 h-3">
            <Image
              src="/crypto-logos/usdt.png"
              alt="USDT"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 p-7 flex-1">
        {/* Tag */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${offer.tagBg} ${offer.tagColor}`}>
            <TagIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {offer.tag}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-black leading-tight text-foreground text-balance"
          style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
        >
          {offer.title}
        </h3>

        {/* Highlighted perk */}
        <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${offer.highlightBg}`}>
          <HighlightIcon className={`w-4 h-4 shrink-0 ${offer.highlightColor}`} aria-hidden="true" />
          <span className={`text-sm font-bold ${offer.highlightColor}`}>{offer.highlight}</span>
        </div>

        {/* Perks list */}
        <ul className="flex flex-col gap-2" aria-label="Beneficios incluidos">
          {offer.perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight
                className="w-4 h-4 shrink-0 text-[#FF6B00] mt-0.5"
                aria-hidden="true"
              />
              {perk}
            </li>
          ))}
        </ul>

        {/* Crypto Toggle con logos */}
        <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B00]/20 rounded-xl p-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="relative w-4 h-4">
                  <Image
                    src="/crypto-logos/bitcoin.png"
                    alt="Bitcoin"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-4 h-4">
                  <Image
                    src="/crypto-logos/usdt.png"
                    alt="USDT"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-foreground">Pagar con Cripto</span>
              <span className="text-[10px] text-[#3DB54A] font-bold">20% OFF</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={payWithCrypto}
                onChange={(e) => setPayWithCrypto(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-[#FF6B00] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </div>
          </label>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-border">
          <div className="flex flex-col leading-tight">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {offer.price}
            </span>
            {payWithCrypto && (
              <span className="text-sm text-gray-400 line-through">
                ${offer.amount.toLocaleString()}
              </span>
            )}
            <span
              className={`text-3xl font-black ${payWithCrypto ? 'text-[#3DB54A]' : 'text-[#FF6B00]'}`}
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              ${discountedPrice.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {offer.per} por persona
              {payWithCrypto && <span className="text-[#3DB54A] ml-1">(20% OFF cripto)</span>}
            </span>
          </div>

          <button
            type="button"
            onClick={openModal}
            className={`
              shrink-0 inline-flex items-center gap-2
              font-black text-xs uppercase tracking-widest
              px-6 py-3.5 rounded-xl
              transition-all duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
              ${payWithCrypto 
                ? 'bg-gradient-to-r from-[#3DB54A] to-[#5DC85C] text-white shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300' 
                : 'bg-[#FF6B00] text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:bg-[#E55A00]'
              }
              hover:scale-105
            `}
          >
            {payWithCrypto ? '💰 RESERVAR CON CRIPTO' : 'Reservar Oferta'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function Offers() {
  const { ref, visible } = useInView(0.1)

  return (
    <section
      id="ofertas"
      aria-labelledby="offers-heading"
      className="relative py-20 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3DB54A 0%, #5DC85C 25%, #FF8C33 70%, #FF6B00 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "#3DB54A" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#FF6B00" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-14">

        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            <span className="block w-8 h-px bg-white/60" aria-hidden="true" />
            Promociones
            <span className="block w-8 h-px bg-white/60" aria-hidden="true" />
          </span>

          <h2
            id="offers-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance leading-[1.1]"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            OFERTAS ESPECIALES
          </h2>

          <p className="max-w-xl text-lg text-white/85 leading-relaxed text-balance">
            Vacaciones de ensueño con beneficios exclusivos
          </p>
          
          {/* Crypto Banner dentro de la sección con logos */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="flex items-center gap-1">
              <div className="relative w-4 h-4">
                <Image
                  src="/crypto-logos/bitcoin.png"
                  alt="Bitcoin"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-4 h-4">
                <Image
                  src="/crypto-logos/usdt.png"
                  alt="USDT"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-xs font-bold text-white">🔥 20% EXTRA DE DESCUENTO PAGANDO CON CRIPTO 🔥</span>
          </div>
        </div>

        {/* Cards — 2 columns on md+, stacked on mobile */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {offers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              delay={i * 150}
              visible={visible}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-white/70 font-medium">
          * Precios por persona en base doble. Sujeto a disponibilidad. Oferta v&aacute;lida hasta agotar existencias.
          <br className="hidden sm:block" />
          ** Descuento del 20% aplicable exclusivamente a pagos con criptomonedas (Bitcoin, USDT, Ethereum).
        </p>
      </div>
    </section>
  )
}