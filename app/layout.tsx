import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import Image from 'next/image'
import { env } from '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coloring Art Generator',
  description: 'Create your own unique AI-generated coloring pages based on your emotions and intentions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
              <header className="w-full max-w-4xl mx-auto p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/coloringart logo.png"
                    alt="Coloring Art Logo"
                    width={150}
                    height={50}
                    className="object-contain"
                  />
                  <h1 className="text-2xl font-bold text-gray-800 hidden md:block">
                    Coloring Art Generator
                  </h1>
                </div>
              </header>
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="w-full border-t border-gray-200 py-4">
                <div className="container mx-auto px-4 text-center text-gray-600">
                  {new Date().getFullYear()} Coloring Art AI. All rights reserved.
                </div>
              </footer>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
