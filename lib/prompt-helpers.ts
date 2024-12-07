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

export function generatePrompt(formData: FormData) {
  const {
    emotions = [],
    emotionalIntensity = 5,
    emotionalQuality,
    energyLevel,
    bodyTension,
    thoughtPattern,
    detailLevel = 'moderate',
    symbols = ['geometric'],
    spiritualIntention,
    naturalElement,
    timeOfDay
  } = formData

  // Build the base prompt parts
  const parts = []

  // Core mandala description
  parts.push(`Create a ${complexityLevels[detailLevel]} mandala design with clean, black line art suitable for a coloring book`)

  // Add emotional elements if specified
  if (emotions.length > 0) {
    const colorChoices = emotions
      .map(emotion => emotionColors[emotion as keyof typeof emotionColors])
      .filter(Boolean)
      .join(' with ')
    parts.push(`The design should be inspired by ${emotions.join(', ')} emotions`)
  }

  // Add optional elements if specified
  if (energyLevel) parts.push(`with ${energyPatterns[energyLevel]} patterns`)
  if (thoughtPattern) parts.push(`incorporating ${thoughtPatternDetails[thoughtPattern]} arrangements`)
  if (naturalElement) parts.push(`featuring ${naturalElementPatterns[naturalElement]} elements`)
  if (bodyTension) parts.push(`emphasizing the ${bodyTension} area through pattern density`)
  if (spiritualIntention) parts.push(`including ${intentionSymbols[spiritualIntention]}`)
  if (timeOfDay) parts.push(`with a ${timeQualities[timeOfDay]} quality`)
  if (emotionalQuality) parts.push(`enhancing ${emotionalQuality} through its structure`)

  // Add symbol specifications
  parts.push(`incorporating ${symbols.map(s => symbolPatterns[s]).join(' and ')}`)

  // Build the final prompt with specific requirements for line art
  const prompt = `${parts.join(', ')}. Make it perfectly symmetrical with clear, crisp black lines on white background, ideal for a coloring book. The design should be completely uncolored with precise outlines and intricate details for coloring. Style: clean line art, black and white illustration, coloring book page.`

  // Enhanced negative prompt for line art
  const negativePrompt = [
    "color",
    "shading",
    "gradient",
    "watercolor",
    "painting",
    "photorealistic",
    "3D",
    "blurry",
    "low quality",
    "distorted",
    "broken symmetry",
    "text",
    "watermark",
    "signature",
    "asymmetrical",
    "messy lines",
    "filled areas",
    "colored regions",
    "grayscale",
    "shadows",
    "depth",
    "texture",
    "background",
    "noise"
  ].join(", ")

  return {
    prompt,
    negativePrompt
  }
}
