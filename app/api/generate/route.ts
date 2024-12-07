import { NextResponse } from 'next/server'
import Replicate from 'replicate'
import { validateEnv, getEnvVar } from '@/lib/env'

// Validate environment variables
validateEnv()

const replicate = new Replicate({
  auth: getEnvVar('REPLICATE_API_TOKEN'),
})

export async function POST(request: Request) {
  try {
    console.log('Received request to generate mandala')
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const { prompt, negativePrompt } = body

    if (!prompt) {
      console.error('Missing prompt in request')
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      )
    }

    console.log('Calling Replicate API with prompt:', prompt)
    console.log('Negative prompt:', negativePrompt)

    try {
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt + " Style: clean line art, black and white illustration, coloring book page, mandala art",
            negative_prompt: negativePrompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            scheduler: "DPMSolverMultistep",
            num_inference_steps: 40,
            guidance_scale: 10.0,
            refine: "expert_ensemble_refiner",
            high_noise_frac: 0.8,
            prompt_strength: 0.8,
          }
        }
      )

      console.log('Replicate API response:', output)

      if (!output || !Array.isArray(output) || output.length === 0) {
        console.error('Invalid output from Replicate:', output)
        return NextResponse.json(
          { error: 'Failed to generate mandala - invalid output' },
          { status: 500 }
        )
      }

      console.log('Successfully generated mandala:', output[0])
      return NextResponse.json({ imageUrl: output[0] })
    } catch (replicateError: any) {
      console.error('Replicate API error:', replicateError)
      return NextResponse.json(
        { error: replicateError?.message || 'Failed to generate mandala - API error' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error generating mandala:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate mandala - server error' },
      { status: 500 }
    )
  }
}
