'use client'

import { z } from 'zod'
import { formSchema } from '@/lib/schemas'
import { generateMandalaInterpretation } from '@/lib/interpretation-helpers'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MandalaInterpretationProps {
  values: z.infer<typeof formSchema>
}

export function MandalaInterpretation({ values }: MandalaInterpretationProps) {
  const interpretation = generateMandalaInterpretation(values)

  return (
    <Card className="w-full mt-8 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          The Meaning of Your Mandala
        </CardTitle>
        <CardDescription className="text-center">
          Discover the spiritual and symbolic meaning of your personal mandala
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
          {interpretation.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                {section.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
