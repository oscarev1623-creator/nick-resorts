"use client"

import { useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Star, TreePalm } from "lucide-react"
import { ReservationContext } from "@/context/reservation-context"

const stats = [
  { value: "15+", label: "Destinos" },
  { value: "4.9★", label: "Valoración" },
  { value: "100%", label: "Todo Incluido" },
]

export function Hero() {
  const { setIsOpen } = useContext(ReservationContext)
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Sección principal — Nick Resorts"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
            src="https://www.youtube.com/embed/phoag3tsu4U?autoplay=1&mute=1&loop=1&playlist=phoag3tsu4U&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Nickelodeon Resorts Video Promocional"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Orange-to-transparent overlay (left) + dark bottom overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(255,107,0,0.85) 0%, rgba(255,107,0,0.55) 30%, rgba(0,0,0,0.35) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative slime drip top */}
      <div
        className="absolute top-0 right-0 left-0 h-2 z-20"
        style={{ backgroundColor: "#FF6B00" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-2xl">

          {/* Logo + Badge combinado - LOGO MÁS GRANDE */}
          <div className="animate-fade-in-up animate-delay-100 flex items-center gap-3 mb-6">
            {/* Logo grande sin cuadro blanco */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 transition-transform duration-300 hover:scale-105">
              <Image
                src="/nicklogo.png"
                alt="Nick Resorts Logo"
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            
            {/* Badge existente */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.40)",
                color: "white",
              }}
            >
              <Star className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
              Vacaciones Todo Incluido · Caribe
            </div>
          </div>

          {/* Main title - ESTILO SIN VECTORES */}
          <h1
            className="animate-fade-in-up animate-delay-200 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-balance mb-6"
            style={{ 
              fontFamily: "var(--font-display, 'Montserrat'), system-ui, sans-serif",
              textTransform: "uppercase"
            }}
          >
            <span className="block">
              <span 
                className="inline-block"
                style={{ 
                  color: "#FF6B00",
                  textShadow: `
                    -1px -1px 0 white,
                    1px -1px 0 white,
                    -1px 1px 0 white,
                    1px 1px 0 white,
                    4px 4px 0px rgba(0,0,0,0.15)
                  `
                }}
              >
                LUJO
              </span>
              <span 
                className="inline-block text-white mx-2"
                style={{ 
                  textShadow: "2px 2px 0px rgba(0,0,0,0.2)"
                }}
              > 
                Y 
              </span>
              <span 
                className="inline-block"
                style={{ 
                  color: "#3DB54A",
                  textShadow: `
                    -1px -1px 0 white,
                    1px -1px 0 white,
                    -1px 1px 0 white,
                    1px 1px 0 white,
                    4px 4px 0px rgba(0,0,0,0.15)
                  `
                }}
              >
                DIVERSIÓN
              </span>
            </span>
            
            <span
              className="block mt-2 text-3xl sm:text-4xl lg:text-5xl text-white"
              style={{ 
                textShadow: `
                  2px 2px 0px #FF6B00,
                  4px 4px 0px rgba(0,0,0,0.2)
                `
              }}
            >
              EN LOS
            </span>
            
            <span
              className="block mt-1 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black"
              style={{
                background: "linear-gradient(135deg, #FF6B00 0%, #FF8C42 50%, #FFD700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 2px 10px rgba(0,0,0,0.25)"
              }}
            >
              NICK RESORTS
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up animate-delay-400 text-base sm:text-lg text-white/90 leading-relaxed mb-10 text-pretty max-w-lg"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.40)" }}
          >
            Vacaciones Todo Incluido en el Caribe.
            <br className="hidden sm:block" />
            Donde la elegancia se encuentra con el{" "}
            <span className="font-extrabold text-white underline decoration-wavy decoration-white/60 underline-offset-2">
              slime.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animate-delay-600 flex flex-wrap gap-4">
            {/* Primary CTA */}
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-extrabold text-white tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{
                backgroundColor: "#FF6B00",
                boxShadow: "0 6px 24px rgba(255,107,0,0.55)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = "#E55A00"
                el.style.boxShadow = "0 8px 32px rgba(255,107,0,0.70)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = "#FF6B00"
                el.style.boxShadow = "0 6px 24px rgba(255,107,0,0.55)"
              }}
            >
              RESERVA AHORA
            </button>

            {/* Secondary CTA */}
            <Link
              href="#ofertas"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-extrabold text-white tracking-wide transition-all duration-200 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent backdrop-blur-sm"
              style={{ border: "2px solid rgba(255,255,255,0.85)" }}
            >
              VER OFERTAS
            </Link>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up animate-delay-600 mt-12 flex flex-wrap gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="text-2xl font-black text-white leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.30)",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-white/75 tracking-widest uppercase mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating card — right side, desktop only */}
        <div
          className="hidden lg:flex absolute right-8 xl:right-16 bottom-28 flex-col gap-3 p-5 rounded-2xl w-64 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.30)",
          }}
          aria-label="Oferta destacada"
        >
          <div className="flex items-center gap-2">
            <TreePalm className="w-5 h-5 text-white" aria-hidden="true" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
              Oferta Especial
            </span>
          </div>
          <p className="text-white font-extrabold text-lg leading-tight">
            Hasta 35% OFF
            <br />
            <span className="font-semibold text-sm text-white/80">
              en paquetes familiares
            </span>
          </p>
          <div
            className="h-px w-full"
            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            aria-hidden="true"
          />
          <p className="text-xs text-white/70 font-medium">
            Válido hasta el 30 de mayo · Incluye niños gratis
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-xs font-semibold text-white/70 tracking-widest uppercase sr-only">
          Desplazar
        </span>
        <ChevronDown
          className="w-6 h-6 text-white/70"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}