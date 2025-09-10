/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // PAT Macro Calendar Dark Theme
        'pat-bg': '#0D1B2A',
        'pat-primary': '#1B9AAA',
        'pat-accent': '#7CFC00',
        'pat-text': '#FFFFFF',
        'pat-muted': '#2E2E2E',
        'pat-border': '#2E2E2E',
        'pat-card': '#111827',
        'pat-hover': '#1b263b',
        
        // Impact colors
        'impact-high': '#7f1d1d',      // red-900
        'impact-high-text': '#fecaca', // red-200
        'impact-medium': '#78350f',    // amber-900
        'impact-medium-text': '#fcd34d', // amber-200
        
        // Sentiment colors
        'sentiment-bullish': '#14532d',     // green-900
        'sentiment-bullish-text': '#bbf7d0', // green-200
        'sentiment-bearish': '#7f1d1d',     // red-900
        'sentiment-bearish-text': '#fecaca', // red-200
        'sentiment-neutral': '#1f2937',     // gray-800
        'sentiment-neutral-text': '#d1d5db'  // gray-300
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
