import type { Metadata } from 'next'
import { Nunito, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ModalProvider } from '@/context/modal-context'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800', '900'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
  description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
  keywords: ['Nickelodeon Resort', 'vacaciones familiares', 'todo incluido', 'Caribe', 'Bob Esponja', 'PAW Patrol', 'slime', 'resort de lujo', 'Punta Cana', 'Riviera Maya'],
  generator: 'v0.app',
  openGraph: {
    title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
    description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Nick Resorts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
    description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="es" 
      className={`${nunito.variable} ${montserrat.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body 
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <ModalProvider>
          {children}
        </ModalProvider>
        <Analytics />
      </body>
    </html>
  )
}