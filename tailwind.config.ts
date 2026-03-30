import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-alpino)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sentient)', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '700',
        black: '900',
      },
    },
  },
  plugins: [],
};

export default config;
