import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        'pn-display': ['var(--font-pn-display)', 'Georgia', 'serif'],
        'pn-body': ['var(--font-pn-body)', 'system-ui', 'sans-serif'],
        'pn-mono': ['var(--font-pn-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Tokens do site público; dentro de .painel as variáveis --c-* os redefinem
        // (paleta clara do painel), então componentes antigos do admin se adaptam sozinhos.
        canvas: 'rgb(var(--c-canvas, 15 17 21) / <alpha-value>)',
        surface: 'rgb(var(--c-surface, 26 29 36) / <alpha-value>)',
        ink: 'rgb(var(--c-ink, 245 245 247) / <alpha-value>)',
        muted2: 'rgb(var(--c-muted2, 160 163 173) / <alpha-value>)',
        'accent-blue': 'rgb(var(--c-accent-blue, 55 138 221) / <alpha-value>)',
        'accent-purple': 'rgb(var(--c-accent-purple, 127 119 221) / <alpha-value>)',
        // Painel de prospecção ("caderno de campo")
        pn: {
          paper: 'rgb(var(--pn-paper) / <alpha-value>)',
          card: 'rgb(var(--pn-card) / <alpha-value>)',
          sunk: 'rgb(var(--pn-sunk) / <alpha-value>)',
          ink: 'rgb(var(--pn-ink) / <alpha-value>)',
          muted: 'rgb(var(--pn-muted) / <alpha-value>)',
          line: 'rgb(var(--pn-line) / <alpha-value>)',
          signal: 'rgb(var(--pn-signal) / <alpha-value>)',
          moss: 'rgb(var(--pn-moss) / <alpha-value>)',
          gold: 'rgb(var(--pn-gold) / <alpha-value>)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
}
export default config
