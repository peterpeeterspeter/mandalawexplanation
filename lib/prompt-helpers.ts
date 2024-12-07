import { z } from "zod"
import { formSchema } from "./schemas"

type FormData = z.infer<typeof formSchema>

// Color mappings for emotions
const emotionColors = {
  joy: 'warm yellows and bright oranges',
  peace: 'soft blues and gentle greens',
  excitement: 'vibrant reds and dynamic purples',
  contemplation: 'deep blues and indigos',
  transformation: 'purples and iridescent colors',
  healing: 'emerald greens and soft pinks'
} as const

// Pattern types based on energy levels
const energyPatterns = {
  low: 'fluid, gentle flowing',
  medium: 'balanced, harmonious',
  high: 'dynamic, radiating'
} as const

// Detail complexity based on thought patterns
const thoughtPatternDetails = {
  analytical: 'precise geometric',
  creative: 'organic flowing',
  reflective: 'layered intricate',
  scattered: 'varied multi-element'
} as const

// Natural element patterns
const naturalElementPatterns = {
  water: 'flowing wave-like',
  earth: 'solid grounding',
  air: 'light floating',
  fire: 'dynamic spiral'
} as const

// Time of day qualities
const timeQualities = {
  dawn: 'soft awakening',
  noon: 'bold clear',
  dusk: 'transitional muted',
  night: 'deep mysterious'
} as const

// Spiritual intention symbols
const intentionSymbols = {
  inner_peace: 'lotus flowers and circular mandalas',
  personal_growth: 'spiral patterns and tree motifs',
  healing: 'heart shapes and flowing lines',
  connection: 'interwoven patterns and unity symbols',
  protection: 'shield motifs and protective geometric shapes',
  wisdom: 'owl motifs and sacred geometry'
} as const

// Symbol type patterns
const symbolPatterns = {
  natural: 'organic elements like flowers, leaves, and trees',
  geometric: 'sacred geometry patterns with circles, triangles, and squares',
  abstract: 'flowing abstract forms and patterns',
  sacred: 'ancient spiritual symbols and mystical elements'
} as const

// Complexity levels
const complexityLevels = {
  simple: 'clear and minimal',
  moderate: 'balanced and harmonious',
  complex: 'intricate and detailed'
} as const

export function generatePrompt(formData: FormData): { prompt: string, negativePrompt: string } {
  const basePrompt = "A beautiful, symmetrical mandala coloring page design"
  const artStyle = "black and white line art, coloring book style, clean lines"
  const familyFriendly = "suitable for all ages, family-friendly, wholesome"
  const technicalDetails = "high contrast, clear outlines, printable quality"

  const emotionWords = formData.emotions.map(emotion => {
    switch (emotion) {
      case 'joy': return 'joyful, uplifting'
      case 'peace': return 'peaceful, serene'
      case 'excitement': return 'dynamic, energetic'
      case 'contemplation': return 'contemplative, meditative'
      case 'transformation': return 'transformative, flowing'
      case 'healing': return 'harmonious, balanced'
      default: return emotion
    }
  }).join(', ')

  const symbolElements = formData.symbols.map(symbol => {
    switch (symbol) {
      case 'natural': return 'organic patterns, leaves, flowers'
      case 'geometric': return 'sacred geometry, circles, triangles'
      case 'abstract': return 'flowing patterns, abstract shapes'
      case 'sacred': return 'spiritual symbols, lotus flowers'
      default: return symbol
    }
  }).join(', ')

  const elementDescription = formData.naturalElement ? {
    water: 'flowing water patterns, waves',
    earth: 'earthy patterns, crystals, mountains',
    air: 'wind patterns, clouds, swirls',
    fire: 'flame patterns, radiant energy'
  }[formData.naturalElement] : ''

  const timeDescription = formData.timeOfDay ? {
    dawn: 'morning energy, rising sun patterns',
    noon: 'radiant patterns, full bloom designs',
    dusk: 'gentle evening patterns, setting sun motifs',
    night: 'star patterns, moon motifs'
  }[formData.timeOfDay] : ''

  const detailLevel = formData.detailLevel ? {
    simple: 'simple and elegant patterns',
    moderate: 'balanced level of detail',
    complex: 'intricate patterns'
  }[formData.detailLevel] : 'balanced level of detail'

  const prompt = [
    basePrompt,
    artStyle,
    familyFriendly,
    technicalDetails,
    emotionWords,
    symbolElements,
    elementDescription,
    timeDescription,
    detailLevel
  ].filter(Boolean).join(', ')

  const negativePrompt = [
    "color, colored, painting",
    "photorealistic, 3d, rendered",
    "complex shading, gradients",
    "inappropriate content, nsfw",
    "dark themes, scary elements",
    "text, words, letters",
    "asymmetrical, unbalanced",
    "photographs, realistic images",
    "faces, figures, people",
    "busy backgrounds, distracting elements"
  ].join(', ')

  return {
    prompt,
    negativePrompt
  }
}
