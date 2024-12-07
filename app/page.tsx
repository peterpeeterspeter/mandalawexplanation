import { GenerateForm } from '@/components/generate-form'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coloring Art Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create your own coloring page by entering a description. The AI will generate a unique coloring page just for you!
          </p>
        </div>
        <GenerateForm />
      </div>
    </main>
  )
}
