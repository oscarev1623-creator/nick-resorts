"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Star, Waves, Users, Sparkles } from "lucide-react"

const highlights = [
  {
    icon: Users,
    color: "text-[#FF6B00]",
    title: "Bob Esponja y PAW Patrol",
    text: "Despierta a tus hijos con el desayuno de sus personajes favoritos. Sesiones de fotos, firmas y shows en vivo todos los días.",
  },
  {
    icon: Waves,
    color: "text-[#3DB54A]",
    title: "Río Lento Temático",
    text: "Flota por un río de un kilómetro rodeado de escenarios inspirados en Bikini Bottom. La experiencia más épica del Caribe.",
  },
  {
    icon: Sparkles,
    color: "text-[#FF6B00]",
    title: "Slime Time Live",
    text: "El show que todos esperan. Concursos, música y el legendario bautizo de slime verde que nadie quiere —y todos adoran.",
  },
]

const photos = [
  { src: "/moments-pool.jpg", alt: "Familia disfrutando la piscina del resort" },
  { src: "/moments-character.jpg", alt: "Niños con personaje de mascota en el resort" },
  { src: "/moments-river.jpg", alt: "Familia en el río lento tropical" },
  { src: "/moments-kids.jpg", alt: "Niños jugando con slime verde" },
]

function useInView(threshold = 0.15) {
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

export function Moments() {
  const router = useRouter()
  const { ref: sectionRef, visible: sectionVisible } = useInView(0.1)
  const { ref: gridRef, visible: gridVisible } = useInView(0.1)

  return (
    <section
      id="momentos"
      aria-labelledby="moments-heading"
      className="relative overflow-hidden py-20 px-4"
      style={{
        background:
          "linear-gradient(135deg, #FFF4EC 0%, #FFF9F5 50%, #F0FFF4 100%)",
      }}
    >
      {/* Decorative blobs — pure CSS, no SVG paths */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: "#FF6B00", filter: "blur(80px)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full opacity-15"
        style={{ background: "#3DB54A", filter: "blur(100px)" }}
      />

      {/* Slime drops — top left corner */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-8 flex gap-3">
        <div className="w-4 h-8 rounded-b-full bg-[#3DB54A] animate-slime-drip shadow-md" />
        <div className="w-3 h-6 rounded-b-full bg-[#3DB54A]/80 animate-slime-drip-delay-1 shadow-sm" />
        <div className="w-2 h-4 rounded-b-full bg-[#3DB54A]/60 animate-slime-drip-delay-2" />
      </div>

      {/* Slime drops — top right corner */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-12 flex gap-2">
        <div className="w-3 h-6 rounded-b-full bg-[#3DB54A]/70 animate-slime-drip-delay-2 shadow-sm" />
        <div className="w-5 h-10 rounded-b-full bg-[#3DB54A] animate-slime-drip shadow-md" />
        <div className="w-2 h-5 rounded-b-full bg-[#3DB54A]/50 animate-slime-drip-delay-1" />
      </div>

      {/* Slime bubble decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 left-4 w-6 h-6 rounded-full bg-[#3DB54A]/30 animate-slime-bubble"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-4 w-4 h-4 rounded-full bg-[#3DB54A]/20 animate-slime-bubble"
        style={{ animationDelay: "0.5s" }}
      />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-16">

        {/* ── Section heading ── */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
            <span className="block w-8 h-px bg-[#FF6B00]" />
            Experiencias Exclusivas
            <span className="block w-8 h-px bg-[#FF6B00]" />
          </span>

          <h2
            id="moments-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance leading-[1.1]"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            Momentos{" "}
            <span className="text-[#FF6B00]">Inolvidables</span>
            <br />
            con tus Personajes Favoritos
          </h2>
        </div>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — text content */}
          <div
            ref={sectionRef}
            className={`
              flex flex-col gap-8
              transition-all duration-700 ease-out
              ${sectionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}
            `}
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              En <span className="font-bold text-foreground">Nick Resorts</span> cada día está lleno
              de magia. Desayuna con Bob Esponja, haz piruetas con PAW Patrol y termina la tarde
              completamente empapado de slime verde. Aquí, los héroes de la televisión se convierten
              en compañeros de vacaciones.
            </p>

            {/* Highlight list */}
            <ul className="flex flex-col gap-6" role="list">
              {highlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className={`
                      flex gap-4 items-start
                      transition-all duration-600 ease-out
                      ${sectionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
                    `}
                    style={{ transitionDelay: `${80 + i * 100}ms` }}
                  >
                    <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-sm border border-border mt-0.5">
                      <Icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-black text-foreground text-base"
                        style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
                      >
                        {item.title}
                      </span>
                      <span className="text-muted-foreground leading-relaxed text-sm">
                        {item.text}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Rating badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3.5 self-start shadow-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">4.9/5</span>
              <span className="text-sm text-muted-foreground">— 12,400+ familias felices</span>
            </div>
          </div>

          {/* RIGHT — 2×2 photo grid */}
          <div
            ref={gridRef}
            className={`
              grid grid-cols-2 gap-3
              transition-all duration-700 ease-out
              ${gridVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
            `}
          >
            {photos.map((photo, i) => (
              <div
                key={photo.src}
                className={`
                  relative overflow-hidden rounded-2xl aspect-square shadow-md
                  transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl
                  ${i === 0 ? "rounded-tl-3xl" : ""}
                  ${i === 1 ? "rounded-tr-3xl" : ""}
                  ${i === 2 ? "rounded-bl-3xl" : ""}
                  ${i === 3 ? "rounded-br-3xl" : ""}
                `}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 45vw, 280px"
                  className="object-cover"
                />
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

        </div>

        {/* ── CTA button ── */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/momentos")}
            className="
              inline-flex items-center justify-center gap-2
              bg-[#FF6B00] text-white font-black text-sm uppercase tracking-widest
              px-10 py-4 rounded-full
              shadow-lg shadow-orange-200
              transition-all duration-200
              hover:bg-[#E55A00] hover:shadow-xl hover:shadow-orange-300 hover:scale-105
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
              cursor-pointer
            "
          >
            Ver Mas
          </button>
        </div>

      </div>
    </section>
  )
}
