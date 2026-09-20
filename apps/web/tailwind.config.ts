// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d0d0d',
        accent: '#ff6b6b',
        secondary: '#1e1e1e',
      },
    },
  },
  plugins: [],
};
