# Changelog

All notable changes to the Kleurplaat Generator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-19

### Added
- Initial release of Kleurplaat Generator
- Comprehensive mindfulness questionnaire in generate-form.tsx
  * Mood selection (calm, stressed, happy, melancholic, focused)
  * Energy level selection (high, balanced, low, restless)
  * Focus intention (relaxation, meditation, creativity, focus, healing)
  * Color preferences (earth, water, fire, air, mixed)
  * Complexity options (simple, balanced, detailed)
- AI integration with SDXL model via Replicate API
- Form validation using Zod with enum types
- UI components from shadcn/ui library
- Toast notifications for user feedback
- Documentation:
  * README.md with project overview
  * TECHNICAL.md with implementation details
  * USER_GUIDE.md with usage instructions

### Changed
- Switched from custom mandala model to SDXL base model
- Updated prompt engineering system with more detailed templates
- Improved error handling in API route
- Enhanced form validation with stricter type checking

### Fixed
- Form submission now correctly sends individual preferences
- API error handling with proper status codes
- Toast notification styling and positioning

## [0.2.0] - 2024-03-19

### Added
- Select component implementation
- Comprehensive error logging
- Loading states during generation
- Input validation and sanitization

### Changed
- Restructured API response handling
- Updated form state management
- Modified prompt construction logic

### Fixed
- Error handling in form submission
- API token security
- Response type definitions

## [0.1.0] - 2024-03-19

### Added
- Initial project setup with Next.js 14
- Basic form structure
- Environment variable configuration
- Project dependencies:
  * next
  * typescript
  * tailwindcss
  * react-hook-form
  * zod
  * shadcn/ui components
  * replicate API client

### Changed
- Updated Next.js configuration
- Modified TypeScript settings
- Enhanced Tailwind setup

### Fixed
- Development environment configuration
- Package dependency conflicts
- TypeScript type definitions
