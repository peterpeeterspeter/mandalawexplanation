"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'

const formSchema = z.object({
  prompt: z.string()
    .min(3, {
      message: "De beschrijving moet minimaal 3 karakters lang zijn",
    }).max(500, {
      message: "De beschrijving mag maximaal 500 karakters lang zijn",
    })
})

type FormData = z.infer<typeof formSchema>

export function ImageGenerator() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setUploadedImage(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Alleen afbeeldingsbestanden zijn toegestaan')
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setUploadedImage(result)
        setError(null)
      }
    }

    reader.onerror = () => {
      setError('Kon de afbeelding niet lezen')
    }

    reader.readAsDataURL(file)
  }

  const onSubmit = async (values: FormData) => {
    if (loading) return

    setLoading(true)
    setError(null)
    setImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: values.prompt,
          imageUrl: uploadedImage
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      if (!data.url) {
        throw new Error('Geen afbeelding ontvangen')
      }

      setImage(data.url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label 
            htmlFor="prompt" 
            className="block text-sm font-medium mb-2"
          >
            Beschrijf je kleurplaat
          </label>
          <textarea
            {...form.register("prompt")}
            id="prompt"
            placeholder="Bijvoorbeeld: een vrolijke olifant in een circus"
            className="w-full p-2 border rounded-md min-h-[100px] resize-y"
            disabled={loading}
          />
          {form.formState.errors.prompt && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.prompt.message}
            </p>
          )}
        </div>

        <div>
          <label 
            htmlFor="image" 
            className="block text-sm font-medium mb-2"
          >
            Upload een afbeelding (optioneel)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
            disabled={loading}
          />
          {uploadedImage && (
            <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
              <Image
                src={uploadedImage}
                alt="Geüploade afbeelding"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Verwijder afbeelding"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Bezig met genereren...
            </span>
          ) : (
            "Genereer Kleurplaat"
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            {error.toLowerCase().includes('verbinding') && 
              'Tip: Controleer je internetverbinding en probeer het opnieuw.'}
            {error.toLowerCase().includes('server') && 
              'Tip: De server is mogelijk tijdelijk niet beschikbaar. Probeer het later opnieuw.'}
            {error.toLowerCase().includes('afbeelding') && 
              'Tip: Probeer een ander bestandsformaat of een kleinere afbeelding.'}
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center p-6 bg-blue-50 rounded-md">
          <p className="text-blue-600">Een moment geduld terwijl we je kleurplaat maken...</p>
          <p className="text-sm text-blue-500 mt-2">Dit kan tot 30 seconden duren.</p>
        </div>
      )}

      {image && (
        <div className="mt-8 space-y-4">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={image}
              alt="Gegenereerde kleurplaat"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="flex gap-4">
            <a
              href={image}
              download="kleurplaat.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors"
            >
              Download Kleurplaat
            </a>
            <button
              onClick={() => window.print()}
              className="flex-1 text-center bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-colors"
            >
              Print Kleurplaat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
