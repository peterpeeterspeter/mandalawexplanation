# KleurplaatAI - AI Mandala Kleurplaat Generator

Een Next.js applicatie die AI gebruikt om gepersonaliseerde mandala kleurplaten te genereren.

## 🎨 Functionaliteiten

- Gepersonaliseerde mandala generatie op basis van voorkeuren
- Uitgebreide vragenlijst voor aanpassing
- Download mogelijkheid voor gegenereerde kleurplaten
- Responsive design voor alle apparaten
- Nederlandse interface

## 🛠 Technische Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Zod voor validatie
- Replicate API (Stability AI SDXL)

## 🚀 Aan de slag

1. Clone de repository
2. Installeer dependencies:
   ```bash
   npm install
   ```

3. Maak een `.env.local` bestand met:
   ```
   REPLICATE_API_TOKEN=jouw_replicate_api_token
   ```

4. Start de development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📝 Omgevingsvariabelen

- `REPLICATE_API_TOKEN`: Token voor de Replicate API (verplicht)

## 🌟 Features

- Personalisatie opties:
  - Doel (stress reductie, focus verbetering, etc.)
  - Complexiteit
  - Basisvorm
  - Thematische elementen
  - Emotionele staat
  - Persoonlijke elementen

- AI Beeldgeneratie:
  - Zwart-wit mandala's
  - Hoge resolutie output
  - Geoptimaliseerd voor printen

## 📦 Project Structuur

```
kleurplaat-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── components/
│   │   └── MandalaQuestionnaire.tsx
│   ├── result/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   └── utils.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🤝 Bijdragen

Voel je vrij om bij te dragen aan dit project door:
1. Een fork te maken
2. Je feature branch te maken (`git checkout -b feature/AmazingFeature`)
3. Je wijzigingen te committen (`git commit -m 'Add some AmazingFeature'`)
4. Te pushen naar de branch (`git push origin feature/AmazingFeature`)
5. Een Pull Request te openen

## 📄 Licentie

Dit project is gelicenseerd onder de ISC License.
