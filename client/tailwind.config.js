/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        apple: {
          light: '#f5f5f7',
          gray: '#e8e8ed',
        },
        // Warm dark luxury palette
        voltify: {
          dark: '#141210',      // Deep charcoal background
          light: '#f5f0e8',     // Warm off-white text
          gold: '#e8a020',      // Gold/amber accent
          border: '#2a2622',    // Subtle border
          hover: '#1f1d1a',     // Hover dark state
        },
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          gold: '#e8a020',
          silver: '#c0c0c0',
        },
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'luxury': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};
