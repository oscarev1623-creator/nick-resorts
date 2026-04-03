"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { ReservationModal } from "@/components/reservation-modal"

const experiences = [
  {
    id: 1,
    title: "Encuentro con Bob Esponja",
    description: "Conoce a Bob Esponja y sus amigos en una experiencia interactiva única.",
    duration: "30 min",
    schedule: "11:00, 14:00, 17:00",
    location: "Plaza Nickelodeon",
    capacity: "30 personas",
    image: "/encuentroconbob.png",
  },
  {
    id: 2,
    title: "Patrulla Canina en vivo",
    description: "Marshall, Chase y Skye te esperan para una aventura inolvidable.",
    duration: "45 min",
    schedule: "10:30, 13:30, 16:30",
    location: "Teatro PAW Patrol",
    capacity: "50 personas",
    image: "/pawpatrol.png",
  },
  {
    id: 3,
    title: "Slime Party",
    description: "La fiesta más divertida del Caribe llena de slime y juegos.",
    duration: "60 min",
    schedule: "15:00, 18:00",
    location: "Piscina Slime",
    capacity: "100 personas",
    image: "/moments-kids.jpg",
  },
  {
    id: 4,
    title: "Río Lento",
    description: "Relájate mientras flotas en nuestro río lento rodeado de naturaleza.",
    duration: "Libre",
    schedule: "09:00 - 18:00",
    location: "Parque Acuático",
    capacity: "Sin límite",
    image: "/riolento.png",
  },
  {
    id: 5,
    title: "Piscina de Olas",
    description: "Disfruta de las olas en nuestra piscina temática.",
    duration: "Libre",
    schedule: "10:00 - 17:00",
    location: "Parque Acuático",
    capacity: "Sin límite",
    image: "/piscinadeolas.png",
  },
  {
    id: 6,
    title: "Kid's Club",
    description: "Espacio seguro y divertido para los más pequeños.",
    duration: "Todo el día",
    schedule: "09:00 - 20:00",
    location: "Área Infantil",
    capacity: "40 niños",
    image: "/kidclub.png",
  },
]

export default function MomentosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <main className="bg-white">
        {/* Header */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-[#FF6B00]/20 to-[#3DB54A]/20">
          <div className="max-w-6xl mx-auto text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-[#FF6B00] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-display">
              Momentos Inolvidables
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Vive experiencias únicas con tus personajes favoritos de Nickelodeon
            </p>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white font-display">{exp.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{exp.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 text-[#FF6B00]" />
                        <span>Duración: {exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-[#FF6B00]" />
                        <span>Horarios: {exp.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-[#FF6B00]" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4 text-[#FF6B00]" />
                        <span>Capacidad: {exp.capacity}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full bg-[#FF6B00] text-white font-bold py-3 rounded-lg hover:bg-[#E55A00] transition-colors duration-200"
                    >
                      RESERVAR EXPERIENCIA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-[#3DB54A]/10 to-[#FF6B00]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-foreground mb-6 font-display">
              Vive la Magia de Nickelodeon
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Et-J9bzSdRU?autoplay=0&controls=1&rel=0"
                title="Nickelodeon Resorts Video Promocional"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de reserva */}
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}