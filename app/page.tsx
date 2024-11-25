'use client'

import { useRouter } from 'next/navigation'
import MandalaQuestionnaire, { type MandalaQuestionnaireData } from '@/app/components/MandalaQuestionnaire'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuestionnaireSubmit = async (data: MandalaQuestionnaireData) => {
    setError(null)
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Er is iets misgegaan')
      }

      if (!result.url) {
        throw new Error('Geen mandala URL ontvangen')
      }

      router.push(`/result?image=${encodeURIComponent(result.url)}`)
    } catch (error) {
      console.error('Error generating mandala:', error)
      setError('Er is iets misgegaan bij het genereren van de mandala. Probeer het opnieuw.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          KleurplaatAI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Creëer je eigen unieke mandala kleurplaat met AI
        </p>
        
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
        
        <MandalaQuestionnaire 
          onSubmit={handleQuestionnaireSubmit} 
          isSubmitting={isGenerating}
        />
      </div>
    </main>
  )
}
