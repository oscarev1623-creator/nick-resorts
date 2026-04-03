"use client"

import { useEffect, useState } from "react"
import { Droplets } from "lucide-react"

export function Loader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white animate-loader-fadeout"
      role="progressbar"
      aria-label="Cargando Nick Resorts"
      aria-busy="true"
    >
      {/* Animated logo */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Spinning icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] flex items-center justify-center animate-loader-spin shadow-lg shadow-orange-200">
            <Droplets className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          {/* Slime drops around logo */}
          <div
            className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#3DB54A] animate-slime-bubble"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-1 -right-3 w-3 h-3 rounded-full bg-[#3DB54A]/70 animate-slime-bubble"
            style={{ animationDelay: "0.3s" }}
            aria-hidden="true"
          />
        </div>

        {/* Logo text */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            <span className="text-[#FF6B00]">NICK</span>{" "}
            <span className="text-foreground">RESORTS</span>
          </h1>
          <p className="text-sm text-muted-foreground animate-loader-pulse">
            Preparando la diversión...
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#3DB54A] rounded-full"
            style={{
              animation: "loaderProgress 2s ease-out forwards",
            }}
          />
        </div>
      </div>

      {/* Progress bar animation */}
      <style jsx>{`
        @keyframes loaderProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
