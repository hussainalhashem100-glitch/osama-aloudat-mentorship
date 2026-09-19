import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfe',
          300: '#7cc2fd',
          400: '#36a2fa',
          500: '#0c87eb',
          600: '#026bc9',
          700: '#0255a2',
          800: '#064885',
          900: '#0a3d6f',
          950: '#07274a',
        },
        navy: {
          800: '#0f1f38',
          900: '#0a1526',
          950: '#050b14',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(15, 23, 42, 0.16)',
        'glow': '0 0 25px -5px rgba(12, 135, 235, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
