import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f7fb',
          100: '#dfeaf4',
          200: '#c4d8ea',
          300: '#9cbddc',
          400: '#6f9dca',
          500: '#4a7fb7',
          600: '#38669f',
          700: '#2f5382',
          800: '#2a4568',
          900: '#253b57',
        },
        safe: '#3b924a',
        caution: '#d6a431',
        danger: '#d64545',
        surface: '#0b1727',
        muted: '#8898aa',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        display: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
