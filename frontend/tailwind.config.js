/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', '"JetBrains Mono"', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: '#e7ebf2',
        input: '#e7ebf2',
        ring: '#9a7547',
        background: '#ffffff',
        foreground: '#1a1a1a',
        gold: {
          50: '#fbf7f1',
          100: '#f5ebdd',
          200: '#ebd6bb',
          300: '#dbba91',
          400: '#c59a68',
          500: '#9a7547',
          600: '#8a683e',
          700: '#735431',
        },
        primary: {
          DEFAULT: '#9a7547',
          foreground: '#ffffff',
        },
        cyber: {
          dark: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          primary: "#3b82f6",
          accent: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          alert: "#ef4444",
        }
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
