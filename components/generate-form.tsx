"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { formSchema } from "@/lib/schemas"
import { generatePrompt } from "@/lib/prompt-helpers"
import { useState } from "react"
import Image from "next/image"
import { MandalaInterpretation } from './mandala-interpretation'
import { Loader2 } from "lucide-react"

type Emotion = "joy" | "peace" | "excitement" | "contemplation" | "transformation" | "healing"
type Symbol = "natural" | "geometric" | "abstract" | "sacred"

export function GenerateForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emotions: [] as Emotion[],
      emotionalIntensity: 5,
      emotionalQuality: undefined,
      energyLevel: undefined,
      bodyTension: undefined,
      thoughtPattern: undefined,
      detailLevel: undefined,
      symbols: [] as Symbol[],
      spiritualIntention: undefined,
      naturalElement: undefined,
      timeOfDay: undefined
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedImage(null)
    setError(null)
    setFormValues(values)

    try {
      const { prompt, negativePrompt } = generatePrompt(values)
      console.log('Sending request with:', { prompt, negativePrompt })
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          negativePrompt
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 429) {
          // Rate limit error
          throw new Error(errorData.error || "Too many requests. Try again later.")
        }
        throw new Error(errorData.error || "Error generating mandala")
      }

      const data = await response.json()
      if (!data.imageUrl) {
        throw new Error("No image received from server")
      }
      
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Emotional Center */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Emotional Center</h2>
            
            <FormField
              control={form.control}
              name="emotions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Your Emotions</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['joy', 'peace', 'excitement', 'contemplation', 'transformation', 'healing'].map((emotion) => (
                        <Button
                          key={emotion}
                          type="button"
                          variant={field.value?.includes(emotion as Emotion) ? 'default' : 'outline'}
                          className="w-full capitalize"
                          onClick={() => {
                            const current = field.value || []
                            const updated = current.includes(emotion as Emotion)
                              ? current.filter(e => e !== emotion)
                              : [...current, emotion as Emotion]
                            field.onChange(updated)
                          }}
                        >
                          {emotion}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emotionalIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional Intensity</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Set the intensity of your emotions from 1 (subtle) to 10 (intense)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Mental State */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Mental State</h2>
            
            <FormField
              control={form.control}
              name="thoughtPattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Thought Pattern</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your thought pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="analytical">Analytical</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="reflective">Reflective</SelectItem>
                      <SelectItem value="scattered">Scattered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Spiritual Elements */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Spiritual Elements</h2>
            
            <FormField
              control={form.control}
              name="symbols"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Symbols</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['natural', 'geometric', 'abstract', 'sacred'].map((symbol) => (
                        <Button
                          key={symbol}
                          type="button"
                          variant={field.value?.includes(symbol as Symbol) ? 'default' : 'outline'}
                          className="w-full capitalize"
                          onClick={() => {
                            const current = field.value || []
                            const updated = current.includes(symbol as Symbol)
                              ? current.filter(s => s !== symbol)
                              : [...current, symbol as Symbol]
                            field.onChange(updated)
                          }}
                        >
                          {symbol}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spiritualIntention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spiritual Intention</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your intention" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inner_peace">Inner Peace</SelectItem>
                      <SelectItem value="personal_growth">Personal Growth</SelectItem>
                      <SelectItem value="healing">Healing</SelectItem>
                      <SelectItem value="connection">Connection</SelectItem>
                      <SelectItem value="protection">Protection</SelectItem>
                      <SelectItem value="wisdom">Wisdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Natural Elements */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Natural Elements</h2>
            
            <FormField
              control={form.control}
              name="naturalElement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Element</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an element" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="earth">Earth</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Time of Day */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Time of Day</h2>
            
            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time of day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dawn">Dawn</SelectItem>
                      <SelectItem value="noon">Noon</SelectItem>
                      <SelectItem value="dusk">Dusk</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Detail Level */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Detail Level</h2>
            
            <FormField
              control={form.control}
              name="detailLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Detail Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select detail level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Mandala'
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {generatedImage && (
        <div className="space-y-8">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
            <Image
              src={generatedImage}
              alt="Generated mandala"
              fill
              className="object-contain"
            />
          </div>
          
          {formValues && <MandalaInterpretation values={formValues} />}
        </div>
      )}
    </div>
  )
}
