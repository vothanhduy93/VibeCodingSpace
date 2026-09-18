/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#f8fafc',
          dark: '#0b0f19',
        },
        zen: {
          slate: '#0f172a',
          body: '#334155',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          glow: 'rgba(124, 58, 237, 0.20)',
          light: '#ede9fe',
        },
        cyan: {
          zen: '#0284c7',
          glow: 'rgba(2, 132, 199, 0.18)',
        },
        emerald: {
          zen: '#059669',
          glow: 'rgba(5, 150, 105, 0.20)',
        },
        amber: {
          zen: '#d97706',
        }
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass-dock': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        'glass-panel': '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'glass-card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'purple-glow': '0 10px 25px -5px rgba(124, 58, 237, 0.35)',
        'cyan-glow': '0 10px 25px -5px rgba(2, 132, 199, 0.30)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
