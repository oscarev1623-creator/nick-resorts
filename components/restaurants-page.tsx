"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, UtensilsCrossed, X, ChevronLeft } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  cuisine: string
  cuisineType: "internacional" | "mariscos" | "infantil" | "gourmet"
  hours: string
  image: string
  menu: string
}

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Sabor Latino",
    cuisine: "Cocina internacional con fusión caribeña",
    cuisineType: "internacional",
    hours: "12:00 PM - 11:00 PM",
    image: "/sabor-latino.jpg",
    menu: "Descubre nuestros platos principales:\n\n• Ceviche de Camarón - Camarones frescos con aguacate y cilantro\n• Arroz a la Valenciana - Con mariscos y azafrán\n• Mofongo con Ropa Vieja - Plátano machacado con carne guisada\n• Ensalada Tropical - Frutas frescas con vinagreta de mango\n\nTodos los platos son Todo Incluido ✓",
  },
  {
    id: "2",
    name: "Aqua Marine",
    cuisine: "Mariscos frescos y parrilla marina",
    cuisineType: "mariscos",
    hours: "1:00 PM - 12:00 AM",
    image: "/aqua-marine.jpg",
    menu: "Especialidades del Mar:\n\n• Langosta a la Parrilla - Con mantequilla de ajo\n• Filete de Pez Vela - Con salsa de tamarindo\n• Camarones al Ajillo - En salsa de ajo casera\n• Paella Marinera - Con camarones, almejas y calamares\n• Tabla de Mariscos - Selección variada para compartir\n\nTodo Incluido ✓",
  },
  {
    id: "3",
    name: "SLIME Factory",
    cuisine: "Comida divertida para niños",
    cuisineType: "infantil",
    hours: "11:00 AM - 9:00 PM",
    image: "/slime-factory.jpg",
    menu: "Menú Kids Especial:\n\n• Hamburguesa Slime Verde - Con papas y salsa verde\n• Nuggets de Pollo Crujientes - Con salsa a elegir\n• Pizza Personal - Queso y pepperoni\n• Pasta Divertida - Con salsa de queso\n• Batido de Slime Especial - Sabor sorpresa\n\nTodo Incluido ✓",
  },
  {
    id: "4",
    name: "SpongeBob's Bikini Bottom",
    cuisine: "Comida temática Nickelodeon",
    cuisineType: "infantil",
    hours: "10:00 AM - 10:00 PM",
    image: "/spongebob-bikini.jpg",
    menu: "Platos Temáticos:\n\n• Krabby Patty - La hamburguesa más famosa del fondo marino\n• Tacos de Camarada Camacho - Especial del restaurante\n• Enchiladas Moradas - Con queso gratinado\n• Pizza Cuadrada SpongeBob - Como la de las películas\n• Postres Temáticos - Decorados como personajes\n\nTodo Incluido ✓",
  },
  {
    id: "5",
    name: "La Cava del Chef",
    cuisine: "Cena gourmet con maridaje",
    cuisineType: "gourmet",
    hours: "6:00 PM - 11:30 PM",
    image: "/la-cava-chef.jpg",
    menu: "Menú Degustación (5 Cursos):\n\n• Entrada: Tabla de Quesos y Embutidos Ibéricos\n• Primer Plato: Ventresca de Atún con Microvegetales\n• Segundo Plato: Filete Mignon con Champiñones Silvestres\n• Postre: Mousse de Chocolate Belga\n• Café y Petit Fours\n\nMaridaje de Vinos Incluido\nTodo Incluido ✓",
  },
  {
    id: "6",
    name: "Sunset Grill",
    cuisine: "Parrilladas al atardecer",
    cuisineType: "internacional",
    hours: "4:00 PM - 11:00 PM",
    image: "/sunset-grill.jpg",
    menu: "Espectacular Carnes a la Parrilla:\n\n• Carne de Res Premium - Corte de Ojo de Bife\n• Pechuga de Pollo Marinada - Con hierbas aromáticas\n• Costillas BBQ - Ahumadas en leña\n• Tabla Mixta para Compartir - Carnes variadas\n• Vegetales y Papas a la Parrilla\n\nTodo Incluido ✓",
  },
]

const cuisineFilters = [
  { value: "todos", label: "Todos" },
  { value: "internacional", label: "Internacional" },
  { value: "mariscos", label: "Mariscos" },
  { value: "infantil", label: "Infantil" },
  { value: "gourmet", label: "Gourmet" },
]

export function RestaurantsPage() {
  const [selectedFilter, setSelectedFilter] = useState("todos")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const filteredRestaurants =
    selectedFilter === "todos"
      ? restaurants
      : restaurants.filter((r) => r.cuisineType === selectedFilter)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/restaurant-hero.jpg"
          alt="Experiencias Gastronómicas - Nick Resorts"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-display text-balance">
            Experiencias Gastronómicas
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Descubre nuestra variedad de cocinas internacionales
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Filtrar por tipo de cocina</h2>
            <div className="flex flex-wrap gap-3">
              {cuisineFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    selectedFilter === filter.value
                      ? "bg-[#FF6B00] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, idx) => (
              <div
                key={restaurant.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                {/* Restaurant Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{restaurant.cuisine}</p>

                  {/* Hours and All-Inclusive */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.hours}</span>
                  </div>

                  {/* All-Inclusive Badge */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B00] mb-4">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Todo Incluido ✓</span>
                  </div>

                  {/* View Menu Button */}
                  <button
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="w-full bg-[#FF6B00] text-white font-bold py-2.5 rounded-lg hover:bg-[#E55A00] transition-colors duration-200"
                  >
                    Ver Menú
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No hay restaurantes disponibles en esta categoría
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Menu Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            {/* Header */}
            <div className="sticky top-0 bg-[#FF6B00] text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="p-1 hover:bg-[#E55A00] rounded-lg transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                {selectedRestaurant.menu.split("\n").map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.startsWith("•")
                        ? "text-gray-700 ml-4 my-1"
                        : line === ""
                          ? "h-2"
                          : "text-gray-900 font-semibold my-2"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Links */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>
      </footer>
    </>
  )
}
