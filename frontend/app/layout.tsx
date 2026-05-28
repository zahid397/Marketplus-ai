import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ConnectionProvider } from '@/contexts/ConnectionContext'
import ConnectionBanner from '@/components/shared/ConnectionBanner'

export const metadata: Metadata = {
  title: 'MarketPulse AI – Pre-Earnings Intelligence',
  description: 'AI-powered pre-earnings financial intelligence platform for institutional investors',
  openGraph: { title: 'MarketPulse AI', description: 'Pre-Earnings Intelligence Before The Market Knows' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConnectionProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ConnectionBanner />
            </ToastProvider>
          </AuthProvider>
        </ConnectionProvider>
      </body>
    </html>
  )
}
