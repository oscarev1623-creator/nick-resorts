"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Perks } from "@/components/perks"
import { Moments } from "@/components/moments"
import { Restaurants } from "@/components/restaurants"
import { Offers } from "@/components/offers"
import { Footer } from "@/components/footer"
import ChatWidget from '@/components/ChatWidget';
import { Loader } from "@/components/loader"
import { ReservationModal } from "@/components/reservation-modal"
import { ReservationContext } from "@/context/reservation-context"

export default function HomePage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false)

  return (
    <ReservationContext.Provider value={{ isOpen: isReservationOpen, setIsOpen: setIsReservationOpen }}>
      <>
        {/* Initial loader */}
        <Loader />

        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#FF6B00] focus:text-white focus:rounded-lg focus:font-bold focus:text-sm"
        >
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content">
          <Hero />
          <Perks />
          <Moments />
          <Restaurants />
          <Offers />
        </main>
        <Footer />
        <ChatWidget />
        <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
      </>
    </ReservationContext.Provider>
  )
}
