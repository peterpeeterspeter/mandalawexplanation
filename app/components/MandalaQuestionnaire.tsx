import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { z } from 'zod';

export const mandalaQuestionnaireSchema = z.object({
  purpose: z.enum(['stress_reduction', 'focus_improvement', 'creative_expression', 'mindfulness'], {
    required_error: "Selecteer een doel voor je mandala",
  }),
  setting: z.enum(['personal', 'therapy', 'workshop', 'decorative'], {
    required_error: "Selecteer een setting voor je mandala",
  }),
  complexity: z.enum(['simple', 'medium', 'complex', 'very_detailed'], {
    required_error: "Selecteer een complexiteitsniveau",
  }),
  baseShape: z.enum(['classic_round', 'square', 'organic', 'geometric'], {
    required_error: "Selecteer een basisvorm",
  }),
  elements: z.enum(['natural', 'geometric', 'symbolic', 'abstract'], {
    required_error: "Selecteer een type elementen",
  }),
  emotion: z.enum(['calm', 'energetic', 'focused', 'balanced'], {
    required_error: "Selecteer een emotionele staat",
  }),
  personalization: z.enum(['initials', 'birthdate', 'totem_animal', 'favorite_shapes', 'none'], {
    required_error: "Selecteer een personalisatie optie",
  }),
  colorPreference: z.enum(['warm', 'cool', 'earth', 'vibrant', 'blackwhite', 'no_preference'], {
    required_error: "Selecteer een kleurvoorkeur",
  })
});

export type MandalaQuestionnaireData = z.infer<typeof mandalaQuestionnaireSchema>;

interface MandalaQuestionnaireProps {
  onSubmit: (data: MandalaQuestionnaireData) => Promise<void>;
  initialData?: Partial<MandalaQuestionnaireData>;
  isSubmitting?: boolean;
}

const sections = [
  {
    title: "Basis Informatie",
    questions: [
      {
        id: 'purpose' as const,
        q: "Wat is het doel van de mandala?",
        options: [
          { value: 'stress_reduction', label: "Stress reductie" },
          { value: 'focus_improvement', label: "Focus verbetering" },
          { value: 'creative_expression', label: "Creatieve expressie" },
          { value: 'mindfulness', label: "Mindfulness oefening" }
        ],
        impact: "Beïnvloedt basis patroon en complexiteit"
      },
      {
        id: 'setting' as const,
        q: "Voor welke setting is de mandala bedoeld?",
        options: [
          { value: 'personal', label: "Persoonlijk gebruik" },
          { value: 'therapy', label: "Therapie sessie" },
          { value: 'workshop', label: "Workshop/training" },
          { value: 'decorative', label: "Decoratief" }
        ],
        impact: "Bepaalt stijl en formaat"
      }
    ]
  },
  {
    title: "Design Voorkeuren",
    questions: [
      {
        id: 'complexity' as const,
        q: "Welk complexiteitsniveau heeft de voorkeur?",
        options: [
          { value: 'simple', label: "Eenvoudig (15-30 min)" },
          { value: 'medium', label: "Gemiddeld (30-60 min)" },
          { value: 'complex', label: "Complex (60-90 min)" },
          { value: 'very_detailed', label: "Zeer gedetailleerd (90+ min)" }
        ],
        impact: "Bepaalt detail niveau en patroon dichtheid"
      },
      {
        id: 'baseShape' as const,
        q: "Welke basis vorm spreekt het meest aan?",
        options: [
          { value: 'classic_round', label: "Klassiek rond" },
          { value: 'square', label: "Vierkant" },
          { value: 'organic', label: "Organisch/Flowing" },
          { value: 'geometric', label: "Geometrisch" }
        ],
        impact: "Definieert hoofdstructuur"
      }
    ]
  },
  {
    title: "Thematische Elementen",
    questions: [
      {
        id: 'elements' as const,
        q: "Welke elementen mogen verwerkt worden?",
        options: [
          { value: 'natural', label: "Natuurlijke vormen" },
          { value: 'geometric', label: "Geometrische patronen" },
          { value: 'symbolic', label: "Symbolische elementen" },
          { value: 'abstract', label: "Abstracte vormen" }
        ],
        impact: "Bepaalt decoratieve details"
      },
      {
        id: 'emotion' as const,
        q: "Welke emotie/staat moet het ondersteunen?",
        options: [
          { value: 'calm', label: "Rust & Kalmte" },
          { value: 'energetic', label: "Energie & Vitaliteit" },
          { value: 'focused', label: "Concentratie & Focus" },
          { value: 'balanced', label: "Balans & Harmonie" }
        ],
        impact: "Beïnvloedt patroon flow en dynamiek"
      }
    ]
  },
  {
    title: "Personalisatie",
    questions: [
      {
        id: 'personalization' as const,
        q: "Moeten er persoonlijke elementen geïntegreerd worden?",
        options: [
          { value: 'initials', label: "Initialen/Naam" },
          { value: 'birthdate', label: "Geboortedatum" },
          { value: 'totem_animal', label: "Totemdier" },
          { value: 'favorite_shapes', label: "Lievelingsvormen" },
          { value: 'none', label: "Geen personalisatie" }
        ],
        impact: "Voegt custom elementen toe"
      },
      {
        id: 'colorPreference' as const,
        q: "Zijn er kleuren die de voorkeur hebben?",
        options: [
          { value: 'warm', label: "Warme tinten" },
          { value: 'cool', label: "Koele tinten" },
          { value: 'earth', label: "Aard tinten" },
          { value: 'vibrant', label: "Felle kleuren" },
          { value: 'blackwhite', label: "Zwart-wit" },
          { value: 'no_preference', label: "Geen voorkeur" }
        ],
        impact: "Geeft kleur suggesties"
      }
    ]
  }
];

const MandalaQuestionnaire: React.FC<MandalaQuestionnaireProps> = ({ onSubmit, initialData = {}, isSubmitting = false }) => {
  const [formData, setFormData] = React.useState<Partial<MandalaQuestionnaireData>>(initialData);
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const handleChange = (questionId: keyof MandalaQuestionnaireData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    setError(null);
    setValidationErrors(prev => ({
      ...prev,
      [questionId]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    
    try {
      const validatedData = mandalaQuestionnaireSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        setError('Vul alstublieft alle verplichte velden in.');
      } else {
        setError('Er is iets misgegaan. Probeer het opnieuw.');
      }
      console.error('Form error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Gepersonaliseerde Mandala Vragenlijst</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {sections.map((section, sIndex) => (
              <div key={sIndex} className="space-y-4">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <div className="space-y-6">
                  {section.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <p className="font-medium">{q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <label key={opt.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt.value}
                              checked={formData[q.id] === opt.value}
                              onChange={(e) => handleChange(q.id, e.target.value)}
                              className="h-4 w-4 text-primary"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors[q.id] && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors[q.id]}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{q.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Mandala Genereren...' : 'Genereer Mandala'}
            </button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default MandalaQuestionnaire;
