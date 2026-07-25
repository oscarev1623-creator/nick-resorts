"use client"

import { MapPin, Mail, Send, Sparkles, Waves, Sun } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const destinations = [
  { name: "Punta Cana", href: "/destinos/punta-cana", description: "República Dominicana" },
  { name: "Riviera Maya", href: "/destinos/riviera-maya", description: "México" },
  { name: "Próximamente: Los Cabos", href: "#", disabled: true, description: "2026" },
]

const quickLinks = [
  { name: "Inicio", href: "/" },
  { name: "Restaurantes", href: "/restaurantes" },
  { name: "Paquetes", href: "/paquetes" },
  { name: "Habitaciones", href: "/habitaciones" },
  { name: "Experiencias", href: "/momentos" },
]

const contactInfo = [
  { icon: MapPin, text: "Punta Cana, República Dominicana" },
  { icon: Send, text: "@NickResortOficial", href: "https://t.me/NickResortOficial", isTelegram: true },
  { icon: Mail, text: "reservas@nickresorts.com", href: "mailto:reservas@nickresorts.com" },
]

const footerLinks = [
  { name: "Política de privacidad", href: "/privacidad" },
  { name: "Términos y condiciones", href: "/terminos" },
  { name: "Preguntas frecuentes", href: "/faq" },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white relative overflow-hidden">
      {/* Decoración - Slime drip superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-[#3DB54A] to-[#FF6B00]" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#3DB54A]/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">

          {/* Columna 1 — Logo y eslogan */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/nicklogo.png"
                  alt="Nick Resorts Logo"
                  fill
                  sizes="(max-width: 768px) 56px, 64px"
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <h3
                  className="text-2xl font-black tracking-tight"
                  style={{
                    fontFamily: "var(--font-display, 'Montserrat', sans-serif)",
                    background: "linear-gradient(135deg, #FF6B00 0%, #FF8C42 50%, #FF6B00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  NICK RESORTS
                </h3>
                <div className="flex gap-1 mt-1">
                  <div className="w-8 h-0.5 bg-[#FF6B00]" />
                  <div className="w-4 h-0.5 bg-[#3DB54A]" />
                </div>
              </div>
            </div>

            <p
              className="text-lg font-bold leading-tight"
              style={{
                fontFamily: "var(--font-display, 'Montserrat', sans-serif)",
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextColor: "transparent",
                backgroundClip: "text",
              }}
            >
              DONDE LOS SUEÑOS
              <br />
              <span className="text-2xl">SE VUELVEN SLIME</span>
            </p>

            <p className="text-sm text-gray-300 leading-relaxed">
              Vive la experiencia más divertida del Caribe. Lujo, diversión y momentos inolvidables con tus personajes favoritos.
            </p>

            <div className="flex gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <Waves className="w-4 h-4 text-[#3DB54A]" />
              <Sun className="w-4 h-4 text-[#FF6B00]" />
            </div>
          </div>

          {/* Columna 2 — Destinos */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              <MapPin className="w-4 h-4" />
              Destinos
            </h4>
            <nav aria-label="Destinos" className="flex flex-col gap-2">
              {destinations.map((dest) => (
                <div key={dest.name} className="group">
                  <a
                    href={dest.href}
                    className={`
                      text-sm transition-all duration-200 block
                      ${dest.disabled
                        ? "text-gray-500 cursor-not-allowed opacity-60"
                        : "text-gray-300 hover:text-[#FF6B00] hover:translate-x-1"
                      }
                    `}
                  >
                    <span className="font-semibold">{dest.name}</span>
                    {dest.description && (
                      <span className="text-xs text-gray-500 block group-hover:text-gray-400">
                        {dest.description}
                      </span>
                    )}
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Columna 3 — Enlaces rápidos */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-black uppercase tracking-wider text-[#FF6B00]"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              Explora Nick
            </h4>
            <nav aria-label="Enlaces rápidos" className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-[#FF6B00] hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-[#FF6B00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 4 — Contacto y redes */}
          <div className="flex flex-col gap-6">
            <h4
              className="text-sm font-black uppercase tracking-wider text-[#FF6B00]"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              Contacto
            </h4>

            <div className="space-y-3">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon
                return (
                  <a
                    key={idx}
                    href={item.href || "#"}
                    target={item.isTelegram ? "_blank" : undefined}
                    rel={item.isTelegram ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-3 text-sm transition-colors duration-200 group ${
                      item.isTelegram ? 'text-[#0088cc] hover:text-[#00aaff]' : 'text-gray-300 hover:text-[#FF6B00]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${item.isTelegram ? 'text-[#0088cc]' : ''}`} />
                    <span>{item.text}</span>
                    {item.isTelegram && (
                      <span className="text-[10px] bg-[#0088cc]/20 px-2 py-0.5 rounded-full text-[#0088cc] font-medium">
                        Telegram
                      </span>
                    )}
                  </a>
                )
              })}
            </div>

            {/* Redes sociales - Solo Telegram */}
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-3">Síguenos</p>
              <a
                href="https://t.me/NickResortOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-full hover:bg-[#006699] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent" />
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Nickelodeon Resorts. Todos los derechos reservados.
          </p>
          <nav aria-label="Políticas" className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors hover:underline underline-offset-4"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}