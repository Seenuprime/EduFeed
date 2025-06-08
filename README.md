# Educational Feed

A Next.js-based web application that displays an infinite scroll of short-form educational content in a swipeable, mobile-friendly feed, similar to TikTok or Instagram Reels.

## Features

- Infinite scroll feed of educational content
- Swipe navigation (up/down) between posts
- Text-to-speech functionality
- Like and save interactions
- Mobile-first, responsive design
- Dynamic content generation using AI
- Smooth animations and transitions

## Prerequisites

- Node.js and npm
- Ollama running locally with the gemma2:2b model

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Seenuprime/EduFeed.git
cd EduFeed
```

2. Install dependencies:
```bash
npm install
```

3. Make sure Ollama is running locally with the gemma2:2b model:
```bash
ollama run gemma2:2b
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Visit `/feed?topic=<topic>` to view the feed for a specific topic
- Available topics: motivation, history, science
- Swipe up/down to navigate between posts
- Use the interaction buttons on the right:
  - ❤️ Like the post
  - 🔊 Toggle text-to-speech
  - 🔖 Save the post

## Technical Details

- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- React Swipeable for touch gestures
- Browser's SpeechSynthesis API for TTS

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── content/
│   │       └── feed/
│   │           └── route.ts
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │   └── components/
│   │   └── ContentCard.tsx
│   │   └── types/
│   │   └── content.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
