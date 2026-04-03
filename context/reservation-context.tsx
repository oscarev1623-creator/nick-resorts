"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

export interface ReservationContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const defaultContextValue: ReservationContextType = {
  isOpen: false,
  setIsOpen: () => undefined,
}

export const ReservationContext = React.createContext<ReservationContextType>(
  defaultContextValue
)

export function ReservationProvider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const value: ReservationContextType = {
    isOpen,
    setIsOpen,
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation(): ReservationContextType {
  const context = useContext(ReservationContext)
  if (!context) {
    return defaultContextValue
  }
  return context
}
