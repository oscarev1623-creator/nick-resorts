"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { UtensilsCrossed, Droplets, BellRing } from "lucide-react"

const cards = [
  {
    icon: UtensilsCrossed,
    iconBg: "bg-orange-50",
    iconColor: "text-[#FF6B00]",
    accentBar: "bg-[#FF6B00]",
    tag: "Gastronomía",
    title: "Gourmet",
    description:
      "Sumérgete en una experiencia culinaria sin igual. Nuestros chefs de clase mundial preparan cocina internacional e ingredientes de temporada en ocho restaurantes temáticos — desde cevicherías caribeñas hasta omakase japonés — todo incluido en tu estancia.",
  },
  {
    icon: Droplets,
    iconBg: "bg-green-50",
    iconColor: "text-[#3DB54A]",
    accentBar: "bg-[#3DB54A]",
    tag: "Diversión Nick",
    title: "Slime Experience",
    description:
      "Vive la magia Nickelodeon en carne propia. Desde la legendaria Slime Zone hasta el Slime Stage Show en vivo, niños y adultos se empapan de diversión verde en actividades diseñadas por los creadores de los personajes más icónicos de la TV.",
  },
  {
    icon: BellRing,
    iconBg: "bg-orange-50",
    iconColor: "text-[#FF6B00]",
    accentBar: "bg-[#FF6B00]",
    tag: "Hospitalidad",
    title: "Servicio Personalizado",
    description:
      "Tu mayordomo personal te acompaña desde el check-in hasta la última puesta de sol. Atención 5 estrellas disponible las 24 horas: servicio a la habitación premium, concierge bilingüe y transfers VIP para que no tengas que preocuparte por nada.",
  },
]

function PerkCard({
  card,
  index,
}: {
  card: (typeof cards)[number]
  index: number
}) {
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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Icon = card.icon

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
      className={`
        group relative flex flex-col bg-white rounded-2xl shadow-md
        border border-border overflow-hidden
        transition-all duration-700 ease-out
        hover:shadow-xl hover:-translate-y-1
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${card.accentBar}`} />

      <div className="flex flex-col gap-5 p-8">
        {/* Icon */}
        <div
          className={`
            inline-flex items-center justify-center w-14 h-14 rounded-xl
            ${card.iconBg} transition-transform duration-300 group-hover:scale-110
          `}
        >
          <Icon className={`w-7 h-7 ${card.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
        </div>

        {/* Tag */}
        <span
          className={`
            self-start text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full
            ${card.iconBg} ${card.iconColor}
          `}
        >
          {card.tag}
        </span>

        {/* Title */}
        <h3
          className="text-2xl font-black text-foreground leading-tight"
          style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
        >
          {card.title}
        </h3>

        {/* Divider */}
        <div className={`w-10 h-0.5 ${card.accentBar} rounded-full`} />

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-[0.9375rem]">
          {card.description}
        </p>
      </div>
    </div>
  )
}

export function Perks() {
  const headingRef = useRef<HTMLDivElement>(null)
  const [headingVisible, setHeadingVisible] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="perks"
      aria-labelledby="perks-heading"
      className="bg-background py-20 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Section heading */}
        <div
          ref={headingRef}
          className={`
            flex flex-col items-center gap-5 text-center
            transition-all duration-700 ease-out
            ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#3DB54A]">
            <span className="block w-8 h-px bg-[#3DB54A]" />
            Todo Incluido
            <span className="block w-8 h-px bg-[#3DB54A]" />
          </span>

          {/* Main title */}
          <h2
            id="perks-heading"
            className="text-5xl md:text-6xl font-black tracking-tight text-balance"
            style={{
              fontFamily: "var(--font-display, 'Montserrat', sans-serif)",
              color: "#FF6B00",
            }}
          >
            CONSIÉNTASE
          </h2>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            El <span className="font-bold text-foreground">"todo incluido"</span> a otro nivel, con
            lo mejor de la cocina gourmet, bebidas de primera calidad y fabulosas actividades.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <PerkCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className={`
            flex flex-col sm:flex-row items-center justify-between gap-6
            bg-[#FF6B00] rounded-2xl px-8 py-7
            transition-all duration-700 ease-out delay-500
            ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <p className="text-white font-bold text-lg text-center sm:text-left leading-snug">
            Todo esto y mucho más está esperando por ti en el paraíso.
          </p>
          <Link
            href="/paquetes"
            className="
              shrink-0 inline-flex items-center justify-center
              bg-white text-[#FF6B00] font-black text-sm uppercase tracking-widest
              px-8 py-3.5 rounded-full
              transition-all duration-200
              hover:bg-orange-50 hover:shadow-lg hover:scale-105
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              cursor-pointer
            "
          >
            Ver Paquetes
          </Link>
        </div>

      </div>
    </section>
  )
}
