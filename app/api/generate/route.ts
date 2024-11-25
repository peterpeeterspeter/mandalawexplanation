import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { z } from 'zod'

// Validate environment variables
if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing required environment variable: REPLICATE_API_TOKEN')
}

// Input validation schema
const mandalaPreferencesSchema = z.object({
  purpose: z.enum(['stress_reduction', 'focus_improvement', 'creative_expression', 'mindfulness']),
  setting: z.enum(['personal', 'therapy', 'workshop', 'decorative']),
  complexity: z.enum(['simple', 'medium', 'complex', 'very_detailed']),
  baseShape: z.enum(['classic_round', 'square', 'organic', 'geometric']),
  elements: z.enum(['natural', 'geometric', 'symbolic', 'abstract']),
  emotion: z.enum(['calm', 'energetic', 'focused', 'balanced']),
  personalization: z.enum(['initials', 'birthdate', 'totem_animal', 'favorite_shapes', 'none']),
  colorPreference: z.enum(['warm', 'cool', 'earth', 'vibrant', 'blackwhite', 'no_preference'])
})

type MandalaPreferences = z.infer<typeof mandalaPreferencesSchema>

function generatePrompt(preferences: MandalaPreferences): string {
  const basePrompt = [
    'black and white mandala coloring page',
    'line art only',
    'white background',
    'symmetrical design',
    'perfect for coloring',
    'high contrast',
    'black lines only',
    'no color',
    'no shading',
    'no text',
    'no watermark'
  ].join(', ')

  const styleMap = {
    purpose: {
      stress_reduction: 'calming and soothing patterns',
      focus_improvement: 'concentric patterns that enhance focus',
      creative_expression: 'expressive and artistic patterns',
      mindfulness: 'meditative and contemplative design'
    },
    setting: {
      personal: 'personalized design',
      therapy: 'therapeutic patterns',
      workshop: 'educational and engaging design',
      decorative: 'decorative and artistic patterns'
    },
    complexity: {
      simple: 'simple and clean lines, minimal detail',
      medium: 'balanced level of detail',
      complex: 'intricate patterns, detailed design',
      very_detailed: 'highly intricate and complex patterns'
    },
    baseShape: {
      classic_round: 'circular mandala with traditional round shape',
      square: 'square mandala with geometric balance',
      organic: 'flowing organic shapes and curves',
      geometric: 'precise geometric patterns and symmetry'
    },
    elements: {
      natural: 'natural forms, leaves, flowers, and organic patterns',
      geometric: 'geometric shapes, sacred geometry, and mathematical patterns',
      symbolic: 'meaningful symbols and spiritual elements',
      abstract: 'abstract and non-representational forms'
    },
    emotion: {
      calm: 'gentle curves and soothing patterns promoting calmness',
      energetic: 'dynamic patterns radiating energy and movement',
      focused: 'structured patterns enhancing concentration',
      balanced: 'harmonious arrangement promoting balance'
    }
  }

  let specificPrompt = [
    styleMap.purpose[preferences.purpose],
    styleMap.setting[preferences.setting],
    styleMap.complexity[preferences.complexity],
    styleMap.baseShape[preferences.baseShape],
    styleMap.elements[preferences.elements],
    styleMap.emotion[preferences.emotion]
  ].join(', ')

  // Add personalization if requested
  if (preferences.personalization !== 'none') {
    const personalizationMap = {
      initials: 'subtle spaces for adding initials or name',
      birthdate: 'numerical pattern elements',
      totem_animal: 'subtle animal motifs',
      favorite_shapes: 'customizable geometric elements'
    }
    specificPrompt += `, ${personalizationMap[preferences.personalization as keyof typeof personalizationMap]}`
  }

  // Add color preference if specified
  if (preferences.colorPreference !== 'no_preference') {
    const colorMap = {
      warm: 'design suitable for warm colors',
      cool: 'design suitable for cool colors',
      earth: 'design suitable for earth tones',
      vibrant: 'design suitable for vibrant colors',
      blackwhite: 'high contrast design for black and white'
    }
    specificPrompt += `, ${colorMap[preferences.colorPreference as keyof typeof colorMap]}`
  }

  return `${basePrompt}. Style: ${specificPrompt}`
}

export async function POST(request: NextRequest) {
  console.log('API route called')
  
  try {
    // Check for API token
    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      console.error('Missing Replicate API token')
      return NextResponse.json(
        { error: 'Server configuratie fout: API token ontbreekt' },
        { status: 500 }
      )
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: apiToken,
    })

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('Request body:', body)
    } catch (error) {
      console.error('Error parsing request body:', error)
      return NextResponse.json(
        { error: 'Ongeldige aanvraag: kon de gegevens niet verwerken' },
        { status: 400 }
      )
    }

    // Validate input
    let preferences
    try {
      preferences = mandalaPreferencesSchema.parse(body)
      console.log('Validated preferences:', preferences)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors)
        return NextResponse.json(
          { error: 'Ongeldige invoer: ' + error.errors[0].message },
          { status: 400 }
        )
      }
      throw error
    }

    // Generate prompt
    const prompt = generatePrompt(preferences)
    console.log('Generated prompt:', prompt)

    // Generate image
    console.log('Calling Replicate API...')
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          negative_prompt: [
            "color", "colorful", "text", "words", "letters",
            "signature", "watermark", "multiple mandalas",
            "asymmetric", "unbalanced", "photograph",
            "realistic", "3d", "shading", "gradients",
            "background", "texture", "noise"
          ].join(", "),
          width: 768,
          height: 768,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          refine: "base_image_refiner",
          high_noise_frac: 0.8,
        }
      }
    )
    console.log('Replicate response:', output)

    // Validate output
    if (!output || !Array.isArray(output) || !output[0]) {
      console.error('Invalid response from Replicate:', output)
      throw new Error('Ongeldig antwoord van de afbeeldingsgeneratie API')
    }

    // Return success response
    return NextResponse.json({ url: output[0] })

  } catch (error) {
    // Log the full error
    console.error('Error in mandala generation:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })

    // Handle specific Replicate errors
    if (error instanceof Error) {
      if (error.message.includes('Replicate') || error.message.includes('API')) {
        return NextResponse.json(
          { error: 'Er is een probleem met de afbeeldingsgeneratie service. Probeer het later opnieuw.' },
          { status: 503 }
        )
      }

      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { error: 'Kon geen verbinding maken met de afbeeldingsgeneratie service. Controleer je internetverbinding.' },
          { status: 503 }
        )
      }

      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Te veel aanvragen. Wacht even en probeer het opnieuw.' },
          { status: 429 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het genereren van de mandala. Probeer het opnieuw.' },
      { status: 500 }
    )
  }
}
