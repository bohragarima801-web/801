/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './app/**/*.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
      './lib/**/*.{js,jsx,ts,tsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
        },
        screens: {
          '2xl': '1400px'
        }
      },
      extend: {
        fontFamily: {
          sans: ['var(--font-noto-sans-devanagari)', 'Noto Sans Devanagari', 'Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
          body: ['var(--font-noto-sans-devanagari)', 'Noto Sans Devanagari', 'Inter', 'system-ui', 'sans-serif'],
          heading: ['var(--font-noto-serif-devanagari)', 'Noto Serif Devanagari', 'var(--font-cinzel)', 'Cinzel', 'serif'],
          serif: ['var(--font-noto-serif-devanagari)', 'Noto Serif Devanagari', 'var(--font-cinzel)', 'Cinzel', 'serif'],
          cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
          vip: ['var(--font-cinzel)', 'Cinzel', 'var(--font-noto-serif-devanagari)', 'serif'],
          hero: ['var(--font-cinzel)', 'Cinzel', 'var(--font-noto-serif-devanagari)', 'serif'],
          devanagari: ['var(--font-noto-serif-devanagari)', 'Noto Serif Devanagari', 'var(--font-noto-sans-devanagari)', 'serif'],
        },
        boxShadow: {
          'golden-glow': '0 0 35px -5px rgba(212, 175, 55, 0.35), 0 0 70px -15px rgba(255, 106, 0, 0.2)',
          'vip-glow': '0 0 24px rgba(212, 175, 55, 0.3)',
          'saffron-glow': '0 8px 25px -4px rgba(255, 106, 0, 0.32)',
          'card-ambient': '0 4px 20px -2px rgba(122, 21, 33, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
          'card-hover': '0 12px 32px -4px rgba(122, 21, 33, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        },
        colors: {
          maroon: {
            DEFAULT: '#7A1F2B',
            dark: '#52131D',
            light: '#962B3B',
            50: '#FDF4F5',
            100: '#F9E5E7',
            200: '#F3CCD0',
          },
          gold: {
            DEFAULT: '#C89B3C',
            highlight: '#E2C46B',
            dark: '#9A7528',
            50: '#FAF6ED',
            100: '#F5ECCE',
          },
          ivory: {
            DEFAULT: '#FFF9F1',
            secondary: '#F7F0E6',
            surface: '#FFFFFF',
            50: '#FFFDF9',
            100: '#FFF9F1',
          },
          sacredText: {
            primary: '#241A18',
            secondary: '#6F625D',
            muted: '#8A7D78',
          },
          sacredBorder: {
            DEFAULT: '#E8DDD0',
            light: '#F2EBE1',
            dark: '#D4C5B3',
          },
          sacredState: {
            success: '#2E7D5B',
            warning: '#B7791F',
            error: '#B42318',
          },
          saffron: {
            DEFAULT: '#B85C24',
            light: '#D97706',
            dark: '#9A4518',
            50: '#FFF8F2',
          },
          charcoal: {
            DEFAULT: '#241A18',
            800: '#342624',
            900: '#1A1412',
          },
          warmborder: '#E8DDD0',
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))'
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))'
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))'
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))'
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))'
          },
          chart: {
            '1': 'hsl(var(--chart-1))',
            '2': 'hsl(var(--chart-2))',
            '3': 'hsl(var(--chart-3))',
            '4': 'hsl(var(--chart-4))',
            '5': 'hsl(var(--chart-5))'
          },
          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          card: '14px',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' }
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' }
          },
          'pulse-fast': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.4' },
          }
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'pulse-fast': 'pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      }
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  }