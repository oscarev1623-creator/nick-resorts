"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ReservationModal } from "@/components/reservation-modal"

interface ModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ReservationModal isOpen={isOpen} onClose={closeModal} />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within ModalProvider")
  }
  return context
}