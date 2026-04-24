import type { Metadata, Viewport } from 'next'
import { Nunito, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ModalProvider } from '@/context/modal-context'
import Script from 'next/script'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
  description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
  keywords: [
    'Nickelodeon Resort',
    'vacaciones familiares',
    'todo incluido',
    'Caribe',
    'Bob Esponja',
    'PAW Patrol',
    'slime',
    'resort de lujo',
    'Punta Cana',
    'Riviera Maya',
    'Nick Resorts',
  ],
  authors: [{ name: 'Nick Resorts' }],
  metadataBase: new URL('https://nick-resorts.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
    description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Nick Resorts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nick Resorts - Vacaciones de lujo en el Caribe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nickelodeon Hotels & Resorts | Vacaciones de Lujo Todo Incluido',
    description: 'Disfruta de vacaciones inolvidables en Nick Resorts con Bob Esponja, PAW Patrol, slime, gastronomía gourmet y todo incluido en el Caribe.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B00' },
    { media: '(prefers-color-scheme: dark)', color: '#E55A00' },
  ],
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
      <head>
        {/* Facebook Pixel - Nick Resorts */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'TU_PIXEL_ID_AQUI');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=TU_PIXEL_ID_AQUI&ev=PageView&noscript=1"
            alt="facebook-pixel"
          />
        </noscript>
      </head>
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