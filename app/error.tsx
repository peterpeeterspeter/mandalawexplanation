'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log any errors to console
    console.error('Page Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
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
  )
}
