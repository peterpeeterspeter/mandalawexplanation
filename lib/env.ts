import { z } from 'zod'

const envSchema = z.object({
  REPLICATE_API_TOKEN: z.string().min(1, "Replicate API token is required"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Coloring Book AI Mandala Generator")
})

export const env = envSchema.parse({
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME
})
