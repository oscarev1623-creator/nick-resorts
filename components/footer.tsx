"use client"

import { Facebook, Instagram, Music, Youtube, Send, Sparkles, Waves, Sun, Shield, HelpCircle, Briefcase, MapPin, Phone, Mail } from "lucide-react"
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
  { name: "Contacto", href: "#" },
]

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/nickresorts", color: "#1877F2" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/nickresorts", color: "#E4405F" },
  { icon: Music, label: "TikTok", href: "https://tiktok.com/@nickresorts", color: "#00F2EA" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/nickresorts", color: "#FF0000" },
]

const footerLinks = [
  { name: "Política de privacidad", href: "/privacidad" },
  { name: "Términos y condiciones", href: "/terminos" },
  { name: "Preguntas frecuentes", href: "/faq" },
  { name: "Trabaja con nosotros", href: "/trabaja" },
]

const contactInfo = [
  { icon: MapPin, text: "Punta Cana, República Dominicana", href: "#" },
  { icon: Phone, text: "+1 (809) 555-0123", href: "tel:+18095550123" },
  { icon: Mail, text: "reservas@nickresorts.com", href: "mailto:reservas@nickresorts.com" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white relative overflow-hidden">
      {/* Decoración de fondo - Slime drips */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-[#3DB54A] to-[#FF6B00]" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#3DB54A]/10 blur-3xl" />
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
          
          {/* Column 1 — Logo & Description */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/nicklogo.png"
                  alt="Nick Resorts Logo"
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <h3
                  className="text-2xl md:text-3xl font-black tracking-tight"
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
              className="text-xl font-bold leading-tight"
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

            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF6B00] transition-colors duration-200 group"
                  >
                    <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>{item.text}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2 — Destinations */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              <MapPin className="w-4 h-4" />
              Destinos de Ensueño
            </h4>
            <nav aria-label="Destinos" className="flex flex-col gap-3">
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

          {/* Column 3 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              <Briefcase className="w-4 h-4" />
              Explora Nick
            </h4>
            <nav aria-label="Enlaces rápidos" className="grid grid-cols-1 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-[#FF6B00] hover:translate-x-1 transition-all duration-200 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-[#FF6B00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 — Social & Newsletter */}
          <div className="flex flex-col gap-6">
            {/* Social Icons */}
            <div className="flex flex-col gap-4">
              <h4
                className="text-sm font-black uppercase tracking-wider text-[#FF6B00]"
                style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
              >
                Síguenos
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Seguir en ${social.label}`}
                      className="
                        w-10 h-10 rounded-full bg-gray-800 text-gray-300
                        flex items-center justify-center
                        hover:scale-110 hover:-translate-y-1
                        transition-all duration-300
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
                      "
                      style={{
                        transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.backgroundColor = social.color
                        el.style.color = "white"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.backgroundColor = "#1f2937"
                        el.style.color = "#9ca3af"
                      }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-4">
              <h4
                className="text-sm font-black uppercase tracking-wider text-[#FF6B00]"
                style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
              >
                Recibe Ofertas Slime
              </h4>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col gap-2"
                aria-label="Suscripción a newsletter"
              >
                <div className="flex gap-2">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Tu mejor email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      flex-1 px-4 py-2.5 rounded-full
                      bg-gray-800 text-white placeholder-gray-500
                      text-sm
                      border border-gray-700 hover:border-[#FF6B00] focus:border-[#FF6B00]
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF6B00]
                      transition-all duration-200
                    "
                    required
                  />
                  <button
                    type="submit"
                    className="
                      shrink-0 w-10 h-10 rounded-full
                      bg-gradient-to-r from-[#FF6B00] to-[#E55A00]
                      text-white
                      flex items-center justify-center
                      hover:scale-105 hover:shadow-lg
                      transition-all duration-200
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
                    "
                    aria-label="Suscribirse al newsletter"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-xs text-[#3DB54A] font-medium animate-pulse">
                    🎉 ¡Gracias por unirte a la aventura! 🎉
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Recibirás slime, diversión y ofertas exclusivas
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Divider con gradiente */}
      <div className="border-t border-gray-800 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent" />
      </div>

      {/* Bottom section — Copyright & Links */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-gray-400">
            © 2025 Nickelodeon Resorts. 
            <span className="hidden md:inline"> </span>
            <br className="md:hidden" />
            Todos los derechos reservados.
          </p>
          <nav aria-label="Políticas" className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-[#FF6B00] transition-colors duration-200 hover:underline underline-offset-4"
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