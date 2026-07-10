"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ReservationModal } from "@/components/reservation-modal"

interface ModalContextType {
  isOpen: boolean
  openModal: (packageId?: string, roomId?: string) => void
  closeModal: () => void
  preselectedPackage: string
  preselectedRoom: string
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preselectedPackage, setPreselectedPackage] = useState('')
  const [preselectedRoom, setPreselectedRoom] = useState('presidential')

  const openModal = (packageId = '', roomId = 'presidential') => {
    setPreselectedPackage(packageId)
    setPreselectedRoom(roomId)
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false)

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, preselectedPackage, preselectedRoom }}>
      {children}
      <ReservationModal
        isOpen={isOpen}
        onClose={closeModal}
        preselectedPackage={preselectedPackage}
        preselectedRoom={preselectedRoom}
      />
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