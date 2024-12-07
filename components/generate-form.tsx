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

type Emotion = "joy" | "peace" | "excitement" | "contemplation" | "transformation" | "healing"
type Symbol = "natural" | "geometric" | "abstract" | "sacred"

export function GenerateForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        throw new Error(errorData.error || "Failed to generate mandala")
      }

      const data = await response.json()
      if (!data.imageUrl) {
        throw new Error("No image URL in response")
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
    <div className="max-w-2xl mx-auto p-4">
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
                  <FormLabel>Present Emotions (Choose up to 3)</FormLabel>
                  <Select
                    onValueChange={(value: Emotion) => {
                      const currentEmotions = field.value || []
                      if (currentEmotions.length < 3 && !currentEmotions.includes(value)) {
                        field.onChange([...currentEmotions, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emotions" />
                    </SelectTrigger>
                    <SelectContent>
                      {['joy', 'peace', 'excitement', 'contemplation', 'transformation', 'healing'].map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selected: {field.value?.join(", ") || "None"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emotionalIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional Intensity (1-10)</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>Current value: {field.value}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emotionalQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional Quality to Enhance</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {['balance', 'growth', 'release', 'protection', 'grounding', 'expansion'].map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Physical Well-being */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Physical Well-being</h2>
            
            <FormField
              control={form.control}
              name="energyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Level</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                    <SelectContent>
                      {['low', 'medium', 'high'].map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bodyTension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Tension Area</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tension area" />
                    </SelectTrigger>
                    <SelectContent>
                      {['center', 'upper', 'lower'].map((area) => (
                        <SelectItem key={area} value={area}>
                          {area.charAt(0).toUpperCase() + area.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Thought Pattern</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select thought pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {['analytical', 'creative', 'reflective', 'scattered'].map((pattern) => (
                        <SelectItem key={pattern} value={pattern}>
                          {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Level</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select detail level" />
                    </SelectTrigger>
                    <SelectContent>
                      {['simple', 'moderate', 'complex'].map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Spiritual Connection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Spiritual Connection</h2>
            
            <FormField
              control={form.control}
              name="symbols"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spiritual Symbols</FormLabel>
                  <Select
                    onValueChange={(value: Symbol) => {
                      const currentSymbols = field.value || []
                      if (!currentSymbols.includes(value)) {
                        field.onChange([...currentSymbols, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbols" />
                    </SelectTrigger>
                    <SelectContent>
                      {['natural', 'geometric', 'abstract', 'sacred'].map((symbol) => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selected: {field.value?.join(", ") || "None"}
                  </FormDescription>
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
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intention" />
                    </SelectTrigger>
                    <SelectContent>
                      {['inner_peace', 'personal_growth', 'healing', 'connection', 'protection', 'wisdom'].map((intention) => (
                        <SelectItem key={intention} value={intention}>
                          {intention.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Environmental Influence */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Environmental Influence</h2>
            
            <FormField
              control={form.control}
              name="naturalElement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Natural Element</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select element" />
                    </SelectTrigger>
                    <SelectContent>
                      {['water', 'earth', 'air', 'fire'].map((element) => (
                        <SelectItem key={element} value={element}>
                          {element.charAt(0).toUpperCase() + element.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {['dawn', 'noon', 'dusk', 'night'].map((time) => (
                        <SelectItem key={time} value={time}>
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Mandala"}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Generated Mandala</h3>
          <div className="relative aspect-square w-full max-w-xl mx-auto">
            <Image
              src={generatedImage}
              alt="Generated Mandala"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
