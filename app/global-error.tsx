'use client'
 
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Er is iets misgegaan!</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Er is een onverwachte fout opgetreden.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Probeer opnieuw
          </button>
        </div>
      </body>
    </html>
  )
}
