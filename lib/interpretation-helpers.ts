import { z } from 'zod'
import { formSchema } from './schemas'

type FormValues = z.infer<typeof formSchema>

interface InterpretationSection {
  title: string
  description: string
}

export function generateMandalaInterpretation(values: FormValues): InterpretationSection[] {
  const interpretation: InterpretationSection[] = []

  // Emotional Center Interpretation
  if (values.emotions.length > 0) {
    const emotionalDescription = values.emotions.map(emotion => {
      switch (emotion) {
        case 'joy':
          return 'joy, representing life force and positive energy'
        case 'peace':
          return 'peace, symbolic of inner harmony and balance'
        case 'excitement':
          return 'excitement, representing creative energy and transformation'
        case 'contemplation':
          return 'contemplation, symbolizing wisdom and self-reflection'
        case 'transformation':
          return 'transformation, a symbol of personal growth and change'
        case 'healing':
          return 'healing, representing restoration and regeneration'
        default:
          return emotion
      }
    }).join(', ')

    interpretation.push({
      title: 'Emotional Meaning',
      description: `Your mandala reflects ${emotionalDescription}. The intensity of this energy is ${values.emotionalIntensity}/10, indicating ${
        values.emotionalIntensity > 7 ? 'a powerful emotional expression' :
        values.emotionalIntensity > 4 ? 'a balanced emotional state' :
        'a subtle emotional undertone'
      }.`
    })
  }

  // Spiritual Symbols Interpretation
  if (values.symbols.length > 0) {
    const symbolDescription = values.symbols.map(symbol => {
      switch (symbol) {
        case 'natural':
          return 'natural elements symbolizing connection with earth'
        case 'geometric':
          return 'geometric shapes representing universal truths and cosmic order'
        case 'abstract':
          return 'abstract patterns reflecting infinite possibilities of consciousness'
        case 'sacred':
          return 'sacred symbols representing spiritual wisdom and divine connection'
        default:
          return symbol
      }
    }).join(', ')

    interpretation.push({
      title: 'Symbolic Meaning',
      description: `Your mandala contains ${symbolDescription}. ${
        values.spiritualIntention ? `This resonates with your intention of ${
          values.spiritualIntention === 'inner_peace' ? 'inner peace' :
          values.spiritualIntention === 'personal_growth' ? 'personal growth' :
          values.spiritualIntention === 'healing' ? 'healing' :
          values.spiritualIntention === 'connection' ? 'connection' :
          values.spiritualIntention === 'protection' ? 'protection' :
          'wisdom'
        }.` : ''
      }`
    })
  }

  // Natural Elements Interpretation
  if (values.naturalElement) {
    const elementDescription = {
      water: 'Water symbolizes emotions, intuition, and adaptability. It represents the flow of life and emotional depth.',
      earth: 'Earth represents stability, growth, and manifestation. It symbolizes your connection to the physical world and practical wisdom.',
      air: 'Air represents intellect, communication, and freedom. It symbolizes mental clarity and new ideas.',
      fire: 'Fire represents transformation, passion, and spiritual energy. It symbolizes inner strength and creative expression.'
    }[values.naturalElement]

    interpretation.push({
      title: 'Elemental Energy',
      description: elementDescription
    })
  }

  // Time of Day Significance
  if (values.timeOfDay) {
    const timeDescription = {
      dawn: 'Dawn symbolizes new beginnings, awakening consciousness, and fresh energy. This is a time of potential and promise.',
      noon: 'Noon represents full power, clarity, and manifestation. This is a time of action and achievement.',
      dusk: 'Dusk symbolizes reflection, transition, and letting go of the day. This is a time of contemplation and rest.',
      night: 'Night represents mystery, dreams, and the subconscious. This is a time of deep wisdom and transformation.'
    }[values.timeOfDay]

    interpretation.push({
      title: 'Temporal Significance',
      description: timeDescription
    })
  }

  // Mental State Interpretation
  if (values.thoughtPattern) {
    const thoughtDescription = {
      analytical: 'Your analytical thought pattern is reflected in the precision and structure of the mandala, indicating a methodical approach to self-reflection.',
      creative: 'Your creative thinking is expressed in the flowing and innovative aspects of the mandala, indicating an open and expressive form of self-development.',
      reflective: 'Your reflective mindset is visible in the layering of the mandala, indicating deep inner wisdom and self-knowledge.',
      scattered: 'Your diverse thought patterns are expressed in the dynamic elements of the mandala, indicating a versatile and adaptive mind.'
    }[values.thoughtPattern]

    interpretation.push({
      title: 'Mental Resonance',
      description: thoughtDescription
    })
  }

  // Add general mandala wisdom
  interpretation.push({
    title: 'Mandala Wisdom',
    description: 'A mandala is a sacred geometric diagram symbolizing the universe and our place within it. Through coloring this mandala, you can achieve a meditative state that helps find inner peace and balance. The circular nature represents the eternal cycle of life and the interconnectivity of all things.'
  })

  return interpretation
}
