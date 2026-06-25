import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { StyledComponentsRegistry } from './registry'
import { Providers } from './providers'
import { ServiceWorkerRegister } from './serviceWorkerRegister'

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MathKids — Học Toán Vui',
  description: 'Web app học toán tương tác cho trẻ em 3-10 tuổi',
  manifest: '/manifest.json',
  themeColor: '#FF6B35',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MathKids',
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={nunito.className}>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            {children}
          </Providers>
          <ServiceWorkerRegister />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
