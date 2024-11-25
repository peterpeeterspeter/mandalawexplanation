# Technical Documentation

This document provides detailed technical information about the Kleurplaat Generator implementation.

## Architecture

### Frontend Architecture

```
components/
├── generate-form.tsx    # Main form component
├── ui/                  # UI components
│   ├── button.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── toast.tsx
│   └── ...
app/
├── layout.tsx           # Root layout
├── page.tsx            # Main page
└── api/                # API routes
    └── generate/
        └── route.ts    # Generation endpoint
```

### Component Details

#### Generate Form (`generate-form.tsx`)
```typescript
// Form Schema
const formSchema = z.object({
  mood: z.enum(['calm', 'stressed', 'happy', 'melancholic', 'focused']),
  energy: z.enum(['high', 'balanced', 'low', 'restless']),
  focus: z.enum(['relaxation', 'meditation', 'creativity', 'focus', 'healing']),
  colors: z.enum(['earth', 'water', 'fire', 'air', 'mixed']),
  complexity: z.enum(['simple', 'balanced', 'detailed'])
})
```

#### API Route (`/api/generate/route.ts`)
- Handles POST requests for mandala generation
- Constructs prompts based on user preferences
- Integrates with Replicate API
- Returns generated image URL

## AI Integration

### Model Configuration
```typescript
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
```

### Prompt Engineering

The application uses a sophisticated prompt engineering system that combines various aspects of the user's preferences:

1. **Mood-based Prompts**
```typescript
const moodPrompts = {
  calm: "sacred geometry mandala with peaceful and harmonious elements, zen-like patterns",
  stressed: "grounding and centering mandala with stable geometric shapes, balanced patterns",
  happy: "joyful and uplifting mandala with dynamic swirls and positive energy",
  melancholic: "soothing and comforting mandala with gentle curves and calming elements",
  focused: "clear and structured mandala with precise geometric shapes and mindful patterns"
}
```

2. **Energy-based Prompts**
```typescript
const energyPrompts = {
  high: "dynamic and vibrant sacred geometry, radiating energy patterns",
  balanced: "harmonious and balanced sacred geometry, perfect symmetrical patterns",
  low: "gentle and calming sacred geometry, soft flowing elements",
  restless: "structured and organizing sacred geometry, rhythmic repetitive patterns"
}
```

3. **Focus-based Prompts**
```typescript
const focusPrompts = {
  relaxation: "calming circular sacred geometry patterns, gentle curves and flowing lines",
  meditation: "spiritual and mystical sacred geometry, ancient wisdom symbols",
  creativity: "playful and imaginative sacred geometry patterns, artistic mandala elements",
  focus: "concentric sacred geometry patterns, clear structure and mindful design",
  healing: "natural and organic sacred geometry patterns, healing symbols and elements"
}
```

## Error Handling

### Frontend Error Handling
```typescript
try {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  })

  if (!response.ok) {
    throw new Error('Generation failed')
  }
} catch (error) {
  toast({
    title: 'Er ging iets mis',
    description: 'Kon geen mandala genereren. Probeer het opnieuw.',
    variant: 'destructive',
  })
}
```

### Backend Error Handling
```typescript
try {
  // API call logic
} catch (error) {
  console.error('Generation error:', error)
  return NextResponse.json(
    { error: 'Failed to generate mandala' },
    { status: 500 }
  )
}
```

## Performance Considerations

1. **Image Generation**
   - High-resolution output (1024x1024)
   - Optimized model parameters for balance of quality and speed
   - Asynchronous generation with loading states

2. **Form Handling**
   - Client-side validation with Zod
   - Debounced form submission
   - Optimistic UI updates

3. **Error Recovery**
   - Graceful fallbacks
   - Retry mechanisms
   - Clear user feedback

## Security Measures

1. **API Security**
   - Environment variables for sensitive data
   - Input validation and sanitization
   - Rate limiting implementation

2. **Form Security**
   - CSRF protection
   - Input sanitization
   - Validation constraints

## Testing Strategy

1. **Unit Tests**
   - Form validation
   - Prompt construction
   - Error handling

2. **Integration Tests**
   - API endpoints
   - Form submission
   - Image generation

3. **E2E Tests**
   - Complete user flows
   - Error scenarios
   - Edge cases

## Deployment

1. **Environment Setup**
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```

2. **Build Process**
   ```bash
   npm run build
   ```

3. **Production Deployment**
   - Vercel deployment recommended
   - Environment variable configuration
   - Build optimization
