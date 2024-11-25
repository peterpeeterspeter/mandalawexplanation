import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Helper function to get mood-based prompts
function getMoodPrompt(mood: string) {
  const moodPrompts = {
    calm: "sacred geometry mandala with peaceful and harmonious elements, zen-like patterns",
    stressed: "grounding and centering mandala with stable geometric shapes, balanced patterns",
    happy: "joyful and uplifting mandala with dynamic swirls and positive energy",
    melancholic: "soothing and comforting mandala with gentle curves and calming elements",
    focused: "clear and structured mandala with precise geometric shapes and mindful patterns"
  }
  return moodPrompts[mood as keyof typeof moodPrompts] || ""
}

// Helper function to get energy-based prompts
function getEnergyPrompt(energy: string) {
  const energyPrompts = {
    high: "dynamic and vibrant sacred geometry, radiating energy patterns",
    balanced: "harmonious and balanced sacred geometry, perfect symmetrical patterns",
    low: "gentle and calming sacred geometry, soft flowing elements",
    restless: "structured and organizing sacred geometry, rhythmic repetitive patterns"
  }
  return energyPrompts[energy as keyof typeof energyPrompts] || ""
}

// Helper function to get focus-based prompts
function getFocusPrompt(focus: string) {
  const focusPrompts = {
    relaxation: "calming circular sacred geometry patterns, gentle curves and flowing lines",
    meditation: "spiritual and mystical sacred geometry, ancient wisdom symbols",
    creativity: "playful and imaginative sacred geometry patterns, artistic mandala elements",
    focus: "concentric sacred geometry patterns, clear structure and mindful design",
    healing: "natural and organic sacred geometry patterns, healing symbols and elements"
  }
  return focusPrompts[focus as keyof typeof focusPrompts] || ""
}

// Helper function to get color-based prompts
function getColorPrompt(colors: string) {
  const colorPrompts = {
    earth: "mandala with earthy elements, organic patterns and natural motifs",
    water: "mandala with flowing water-inspired elements, wave patterns",
    fire: "mandala with dynamic fire-inspired elements, spiral patterns",
    air: "mandala with light and airy elements, delicate patterns",
    mixed: "mandala with diverse elements and varied patterns"
  }
  return colorPrompts[colors as keyof typeof colorPrompts] || ""
}

// Helper function to get complexity-based prompts
function getComplexityPrompt(complexity: string) {
  const complexityPrompts = {
    simple: "simple and clear sacred geometry with large elements and basic patterns",
    balanced: "balanced sacred geometry with medium detail level and harmonious elements",
    detailed: "intricate and detailed sacred geometry with complex patterns and fine details"
  }
  return complexityPrompts[complexity as keyof typeof complexityPrompts] || ""
}

export async function POST(request: Request) {
  try {
    const { mood, energy, focus, colors, complexity } = await request.json()

    if (!mood || !energy || !focus || !colors || !complexity) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Combine all prompts for a detailed mandala description
    const fullPrompt = `Create a beautiful mandala with ${getMoodPrompt(mood)}, ${getEnergyPrompt(energy)}, ${getFocusPrompt(focus)}, ${getColorPrompt(colors)}, ${getComplexityPrompt(complexity)}. Make it a beautiful black and white mandala suitable for coloring, with clear lines and perfect symmetry.`

    console.log('Generating mandala with prompt:', fullPrompt)

    // Run the model
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: fullPrompt,
          negative_prompt: "ugly, blurry, low quality, distorted, broken symmetry, text, watermark",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          scheduler: "K_EULER",
          seed: Math.floor(Math.random() * 1000000)
        }
      }
    )

    if (!output || !output[0]) {
      console.error('No output from Replicate')
      return NextResponse.json(
        { error: 'Failed to generate mandala' },
        { status: 500 }
      )
    }

    console.log('Successfully generated mandala:', output[0])
    return NextResponse.json({ imageUrl: output[0] })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate mandala' },
      { status: 500 }
    )
  }
}
