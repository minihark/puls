/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        puls: {
          950: '#07090E',
          900: '#0B0F17',
          850: '#101622',
          800: '#172030',
          700: '#233047',
          600: '#344563',
          500: '#526688',
          400: '#889BBA',
          300: '#B8C6DC',
          200: '#DDE5F0',
          100: '#F1F5F9',
        },
        cyan: {
          glow: '#00F0FF',
          dim: '#0095A8',
        },
        amber: {
          xrp: '#F59E0B',
          glow: '#FBBF24',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'pulse-ring': '0 0 0 4px rgba(0, 240, 255, 0.2)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
