"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Star, BadgeCheck, UtensilsCrossed, Fish, Laugh } from "lucide-react"

const restaurants = [
  {
    image: "/restaurant-latino.jpg",
    alt: "Plato gourmet del restaurante Sabor Latino",
    name: "Sabor Latino",
    cuisine: "Internacional",
    icon: UtensilsCrossed,
    iconColor: "text-[#FF6B00]",
    iconBg: "bg-orange-50",
    description:
      "Un viaje culinario por América Latina y el mundo. Ingredientes frescos, sazón auténtica y presentaciones de alta cocina que deleitan a toda la familia.",
    tag: "Todo Incluido",
  },
  {
    image: "/restaurant-aqua.jpg",
    alt: "Plato de sushi del restaurante Aqua Marine",
    name: "Aqua Marine",
    cuisine: "Mariscos",
    icon: Fish,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    description:
      "Los mejores mariscos del Caribe, servidos frente al mar. Desde ceviche fresco hasta sushi de autor y langosta a la parrilla.",
    tag: "Especialidad Chef",
  },
  {
    image: "/restaurant-slime.jpg",
    alt: "Comida divertida del restaurante SLIME Factory",
    name: "SLIME Factory",
    cuisine: "Comida divertida para niños",
    icon: Laugh,
    iconColor: "text-[#3DB54A]",
    iconBg: "bg-green-50",
    description:
      "El restaurante más divertido del resort. Menús temáticos de Nickelodeon, batidos de colores y las famosas slime-burgers que los niños adoran.",
    tag: "Favorito Familiar",
  },
]

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

function RestaurantCard({
  restaurant,
  delay,
  visible,
}: {
  restaurant: (typeof restaurants)[number]
  delay: number
  visible: boolean
}) {
  const Icon = restaurant.icon

  return (
    <article
      className={`
        group flex flex-col bg-white rounded-3xl overflow-hidden border border-border
        shadow-sm hover:shadow-xl hover:-translate-y-1.5
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={restaurant.image}
          alt={restaurant.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Tag badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          <BadgeCheck className="w-3.5 h-3.5 text-[#FF6B00]" aria-hidden="true" />
          {restaurant.tag}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Icon + name + cuisine */}
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${restaurant.iconBg} mt-0.5 transition-colors duration-200 group-hover:bg-green-50`}
          >
            <Icon
              className={`w-5 h-5 ${restaurant.iconColor} icon-hover-slime`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
          <div>
            <h3
              className="font-black text-lg leading-tight text-foreground"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              {restaurant.name}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              {restaurant.cuisine}
            </p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1" role="img" aria-label="5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {restaurant.description}
        </p>

        {/* CTA button */}
        <button
          className="
            mt-auto w-full py-3 rounded-xl
            border-2 border-[#FF6B00] text-[#FF6B00]
            font-black text-sm uppercase tracking-widest
            transition-all duration-200
            hover:bg-[#FF6B00] hover:text-white hover:shadow-md hover:shadow-orange-200
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
            cursor-pointer
          "
          onClick={() => {
            const id = restaurant.name.toLowerCase().replace(/\s+/g, '-')
            window.location.href = `/restaurantes#menu-${id}`
          }}
        >
          Ver Menu
        </button>
      </div>
    </article>
  )
}

export function Restaurants() {
  const { ref, visible } = useInView(0.1)

  return (
    <section id="restaurantes" aria-labelledby="restaurants-heading" className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">

        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
            <span className="block w-8 h-px bg-[#FF6B00]" aria-hidden="true" />
            Gastronomia
            <span className="block w-8 h-px bg-[#FF6B00]" aria-hidden="true" />
          </span>

          <h2
            id="restaurants-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance leading-[1.1]"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            Experiencias{" "}
            <span className="text-[#FF6B00]">Gastron&oacute;micas</span>
          </h2>

          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance">
            Del&eacute;itate con una variedad de cocinas internacionales en nuestros
            restaurantes de clase mundial.
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {restaurants.map((r, i) => (
            <RestaurantCard
              key={r.name}
              restaurant={r}
              delay={i * 120}
              visible={visible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center">
          <Link
            href="/restaurantes"
            className="
              inline-flex items-center justify-center gap-2
              border-2 border-[#FF6B00] text-[#FF6B00]
              font-black text-sm uppercase tracking-widest
              px-10 py-4 rounded-full
              transition-all duration-200
              hover:bg-[#FF6B00] hover:text-white hover:shadow-lg hover:shadow-orange-200 hover:scale-105
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]
              cursor-pointer
            "
          >
            Ver Todos los Restaurantes
          </Link>
        </div>

      </div>
    </section>
  )
}
