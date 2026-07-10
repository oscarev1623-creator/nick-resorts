"use client"

import { ReactNode } from "react"
import { ModalProvider } from "@/context/modal-context"

export function Providers({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>
}
