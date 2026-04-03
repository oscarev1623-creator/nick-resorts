"use client"

import { useContext, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ReservationContext } from "@/context/reservation-context"

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Experiencias", href: "#perks" },
  { label: "Restaurantes", href: "/restaurantes" },
  { label: "Paquetes", href: "/paquetes" },
  { label: "Ofertas", href: "#ofertas" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { setIsOpen: setIsReservationOpen } = useContext(ReservationContext)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md shadow-black/5"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo mucho más grande */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="Nick Resorts — Inicio"
          >
            {/* Logo grande - 56px en móvil, 72px en desktop */}
            <div className="relative w-14 h-14 md:w-[72px] md:h-[72px] transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/nicklogo.png"
                alt="Nick Resorts Logo"
                fill
                sizes="(max-width: 768px) 56px, 72px"
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span
              className="text-xl md:text-2xl font-black tracking-tight leading-none"
              style={{ color: "#FF6B00", fontFamily: "var(--font-display)" }}
            >
              NICK
              <span className="text-foreground font-extrabold"> RESORTS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 group"
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{ backgroundColor: "#FF6B00" }}
                  aria-hidden="true"
                />
              </Link>
            ))}

            <Link
              href="#reservar"
              className="ml-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-extrabold text-white tracking-wide shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: "#FF6B00",
                boxShadow: "0 4px 14px rgba(255, 107, 0, 0.40)",
              }}
              onClick={(e) => {
                e.preventDefault()
                setIsReservationOpen(true)
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#E55A00")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#FF6B00")
              }
            >
              RESERVAR
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-secondary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <nav
          className="bg-white border-t border-border px-4 pt-3 pb-5 flex flex-col gap-1"
          aria-label="Navegación móvil"
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              aria-label={`Ir a ${link.label}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#reservar"
            className="mt-3 flex items-center justify-center px-6 py-3 rounded-full text-sm font-extrabold text-white tracking-wide transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            style={{ backgroundColor: "#FF6B00" }}
            onClick={(e) => {
              e.preventDefault()
              setIsReservationOpen(true)
              setIsOpen(false)
            }}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Hacer una reservación"
          >
            RESERVAR
          </Link>
        </nav>
      </div>
    </header>
  )
}