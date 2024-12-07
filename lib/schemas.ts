import * as z from "zod"

export const formSchema = z.object({
  // Emotional Center
  emotions: z.array(z.enum(['joy', 'peace', 'excitement', 'contemplation', 'transformation', 'healing']))
    .min(1)
    .max(3)
    .default([]),
  emotionalIntensity: z.number().min(1).max(10).default(5),
  emotionalQuality: z.enum(['balance', 'growth', 'release', 'protection', 'grounding', 'expansion'])
    .optional(),

  // Physical Well-being
  energyLevel: z.enum(['low', 'medium', 'high'])
    .optional(),
  bodyTension: z.enum(['center', 'upper', 'lower'])
    .optional(),

  // Mental State
  thoughtPattern: z.enum(['analytical', 'creative', 'reflective', 'scattered'])
    .optional(),
  detailLevel: z.enum(['simple', 'moderate', 'complex'])
    .default('moderate'),

  // Spiritual Connection
  symbols: z.array(z.enum([
    'natural',    // flowers, leaves, trees
    'geometric',  // circles, triangles, squares
    'abstract',   // abstract patterns
    'sacred'      // sacred symbols
  ])).min(1).default(['geometric']),
  spiritualIntention: z.enum([
    'inner_peace',
    'personal_growth',
    'healing',
    'connection',
    'protection',
    'wisdom'
  ]).optional(),

  // Environmental Influence
  naturalElement: z.enum(['water', 'earth', 'air', 'fire'])
    .optional(),
  timeOfDay: z.enum(['dawn', 'noon', 'dusk', 'night'])
    .optional()
})
