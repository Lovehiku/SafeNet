import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Main orange
          600: '#ea580c', // Darker orange for hover
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Status colors adapted for white background
        safe: '#22c55e', // Light green that works on white
        caution: '#f97316', // Orange (brand color)
        danger: '#dc2626', // Red-orange for danger
        surface: '#ffffff', // White background
        muted: '#6b7280', // Neutral gray for muted text
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        display: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
