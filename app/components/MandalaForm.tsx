'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MandalaPreferences {
  theme: string
  complexity: string
  style: string
  elements?: string[]
  mood?: string
  size: string
}

export default function MandalaForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preferences, setPreferences] = useState<MandalaPreferences>({
    theme: 'geometric',
    complexity: 'medium',
    style: 'modern',
    size: 'medium',
  })

  const themes = [
    { value: 'nature', label: 'Natuur' },
    { value: 'geometric', label: 'Geometrisch' },
    { value: 'floral', label: 'Bloemen' },
    { value: 'cosmic', label: 'Kosmisch' },
    { value: 'abstract', label: 'Abstract' },
  ]

  const complexities = [
    { value: 'simple', label: 'Eenvoudig' },
    { value: 'medium', label: 'Gemiddeld' },
    { value: 'complex', label: 'Complex' },
  ]

  const styles = [
    { value: 'modern', label: 'Modern' },
    { value: 'traditional', label: 'Traditioneel' },
    { value: 'tribal', label: 'Tribal' },
    { value: 'celtic', label: 'Keltisch' },
  ]

  const moods = [
    { value: 'calm', label: 'Kalm' },
    { value: 'energetic', label: 'Energiek' },
    { value: 'balanced', label: 'Gebalanceerd' },
    { value: 'spiritual', label: 'Spiritueel' },
  ]

  const sizes = [
    { value: 'small', label: 'Klein (512x512)' },
    { value: 'medium', label: 'Middel (768x768)' },
    { value: 'large', label: 'Groot (1024x1024)' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan')
      }

      // Handle successful response
      router.push(`/result?image=${encodeURIComponent(data.url)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          Personaliseer je Mandala Kleurplaat
        </h1>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thema
          </label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            {themes.map(theme => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>

        {/* Complexity Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Complexiteit
          </label>
          <select
            name="complexity"
            value={preferences.complexity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            {complexities.map(complexity => (
              <option key={complexity.value} value={complexity.value}>
                {complexity.label}
              </option>
            ))}
          </select>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Stijl
          </label>
          <select
            name="style"
            value={preferences.style}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            {styles.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Stemming (optioneel)
          </label>
          <select
            name="mood"
            value={preferences.mood || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Kies een stemming</option>
            {moods.map(mood => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Formaat
          </label>
          <select
            name="size"
            value={preferences.size}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            {sizes.map(size => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Genereren...' : 'Genereer Mandala'}
        </button>
      </div>
    </form>
  )
}
