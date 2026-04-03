"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phoneNumber = "18091234567" // Replace with actual number
  const message = encodeURIComponent("Hola, me gustaría obtener más información sobre Nick Resorts.")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-[#25D366] text-white
        flex items-center justify-center
        shadow-lg shadow-green-500/30
        hover:bg-[#20BD5A] hover:scale-110 hover:shadow-xl hover:shadow-green-500/40
        active:scale-95
        transition-all duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]
      "
    >
      <MessageCircle className="w-7 h-7" aria-hidden="true" />
      {/* Ping attention animation every 10 seconds */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-ping"
        aria-hidden="true"
      />
      {/* Subtle outer glow ring */}
      <span
        className="absolute -inset-1 rounded-full border-2 border-[#25D366]/30 animate-whatsapp-ping"
        aria-hidden="true"
        style={{ animationDelay: "0.1s" }}
      />
    </a>
  )
}
