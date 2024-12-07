import { GenerateForm } from '@/components/generate-form'

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Kleurplaat Generator</h1>
        <p className="text-gray-600 text-center mb-8">
          Maak je eigen kleurplaat door een beschrijving in te voeren.
          De AI zal een unieke kleurplaat voor je genereren!
        </p>
        <GenerateForm />
      </div>
    </main>
  )
}
