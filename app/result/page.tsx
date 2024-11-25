'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('image')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imageUrl) {
      setError('Geen mandala afbeelding gevonden')
    }
  }, [imageUrl])

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mandala-kleurplaat.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Er is iets misgegaan bij het downloaden van de afbeelding')
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Oeps!</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href="/"
              className="inline-block py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Terug naar begin
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            Je Mandala is Klaar!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Download je unieke mandala kleurplaat en begin met kleuren
          </p>

          {imageUrl && (
            <div className="space-y-8">
              <div className="aspect-square relative bg-white rounded-lg shadow-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Gegenereerde mandala kleurplaat"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Download Kleurplaat
                </button>
                <Link
                  href="/"
                  className="py-2 px-4 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Maak Nog Een Mandala
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
