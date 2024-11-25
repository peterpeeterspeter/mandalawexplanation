'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/components/ui/use-toast'

const formSchema = z.object({
  mood: z.enum(['calm', 'stressed', 'happy', 'melancholic', 'focused'], {
    required_error: "Selecteer je huidige gemoedstoestand",
  }),
  energy: z.enum(['high', 'balanced', 'low', 'restless'], {
    required_error: "Selecteer je energieniveau",
  }),
  focus: z.enum(['relaxation', 'meditation', 'creativity', 'focus', 'healing'], {
    required_error: "Selecteer waar je je op wilt focussen",
  }),
  colors: z.enum(['earth', 'water', 'fire', 'air', 'mixed'], {
    required_error: "Selecteer je kleurvoorkeur",
  }),
  complexity: z.enum(['simple', 'balanced', 'detailed'], {
    required_error: "Selecteer het detailniveau",
  }),
})

export function GenerateForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      energy: '',
      focus: '',
      colors: '',
      complexity: 'balanced',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: '',  // Base prompt is empty, we'll use the preferences
          mood: values.mood,
          energy: values.energy,
          focus: values.focus,
          colors: values.colors,
          complexity: values.complexity,
        }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
      toast({
        title: 'Je persoonlijke mandala is gegenereerd!',
        description: 'Je kunt de mandala nu downloaden en inkleuren.',
      })
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: 'Er ging iets mis',
        description: 'Kon geen mandala genereren. Probeer het opnieuw.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Persoonlijke Mandala Generator</h2>
        <p className="text-gray-600">
          Beantwoord deze vragen om een mandala te creëren die perfect bij jouw mindset past.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hoe voel je je op dit moment?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer je gemoedstoestand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="calm">Kalm en vredig</SelectItem>
                    <SelectItem value="stressed">Gestrest of onrustig</SelectItem>
                    <SelectItem value="happy">Blij en optimistisch</SelectItem>
                    <SelectItem value="melancholic">Melancholisch</SelectItem>
                    <SelectItem value="focused">Geconcentreerd</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Je huidige gemoedstoestand helpt bij het creëren van een passende mandala.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wat is je energieniveau?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer je energieniveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">Veel energie</SelectItem>
                    <SelectItem value="balanced">In balans</SelectItem>
                    <SelectItem value="low">Weinig energie</SelectItem>
                    <SelectItem value="restless">Rusteloos</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Dit helpt bij het bepalen van de dynamiek in je mandala.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waar wil je je op focussen tijdens het kleuren?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer je focus" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="relaxation">Ontspanning</SelectItem>
                    <SelectItem value="meditation">Meditatie</SelectItem>
                    <SelectItem value="creativity">Creativiteit</SelectItem>
                    <SelectItem value="focus">Concentratie</SelectItem>
                    <SelectItem value="healing">Innerlijke healing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Dit bepaalt het thema en de intentie van je mandala.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welke kleuren spreken je aan?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer je kleurvoorkeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="earth">Aardse tinten (bruin, groen)</SelectItem>
                    <SelectItem value="water">Water tinten (blauw, turquoise)</SelectItem>
                    <SelectItem value="fire">Vurige tinten (rood, oranje)</SelectItem>
                    <SelectItem value="air">Luchtige tinten (wit, lichtblauw)</SelectItem>
                    <SelectItem value="mixed">Gemengde kleuren</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  De kleurthema's zullen de energie van je mandala beïnvloeden.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hoeveel detail wil je in je mandala?</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="simple" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Eenvoudig - Grote, rustige patronen
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="balanced" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Gebalanceerd - Mix van grote en kleine elementen
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="detailed" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Gedetailleerd - Complexe, intricate patronen
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormDescription>
                  Dit bepaalt hoe complex en gedetailleerd je mandala wordt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Mandala wordt gegenereerd...' : 'Genereer Mijn Mandala'}
          </Button>
        </form>
      </Form>

      {generatedImage && (
        <div className="mt-8 space-y-4">
          <img
            src={generatedImage}
            alt="Generated mandala"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => window.open(generatedImage, '_blank')}
              className="w-full"
            >
              Download Mandala
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function constructMandalaPrompt(values: any) {
  const basePrompt = "Create a beautiful mandala with "
  
  // Add mood-specific elements
  const moodElements = {
    calm: "peaceful and harmonious elements",
    stressed: "grounding and stabilizing patterns",
    happy: "joyful and uplifting designs",
    melancholic: "soothing and gentle patterns",
    focused: "clear and structured elements"
  }

  // Add energy-specific elements
  const energyElements = {
    high: "dynamic and vibrant flow",
    balanced: "perfect balance and harmony",
    low: "gentle and calming energy",
    restless: "organized and rhythmic patterns"
  }

  // Add focus-specific elements
  const focusElements = {
    relaxation: "relaxing circular patterns",
    meditation: "spiritual and mystical symbols",
    creativity: "creative and imaginative designs",
    focus: "concentric and focused patterns",
    healing: "healing symbols and natural elements"
  }

  // Add color-specific elements
  const colorElements = {
    earth: "earth-toned patterns and natural motifs",
    water: "flowing water-like patterns",
    fire: "dynamic fire-inspired elements",
    air: "light and ethereal patterns",
    mixed: "diverse and colorful elements"
  }

  // Add complexity-specific elements
  const complexityElements = {
    simple: "with clean, simple lines and large patterns",
    balanced: "with balanced detail and medium-sized elements",
    detailed: "with intricate details and complex patterns"
  }

  // Construct the final prompt
  const prompt = `${basePrompt} 
    ${moodElements[values.mood as keyof typeof moodElements] || ''}, 
    ${energyElements[values.energy as keyof typeof energyElements] || ''}, 
    ${focusElements[values.focus as keyof typeof focusElements] || ''}, 
    ${colorElements[values.colors as keyof typeof colorElements] || ''} 
    ${complexityElements[values.complexity as keyof typeof complexityElements] || ''}.
    Make it a beautiful black and white mandala suitable for coloring, with clear lines and perfect symmetry.`

  return prompt
}
