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
          saffron: {
            DEFAULT: '#FF6A00',
            light: '#FF8500',
            dark: '#E65C00',
            50: '#FFF3E8',
            100: '#FFE4CC',
            200: '#FFC899',
            500: '#FF6A00',
            600: '#FF5500',
            700: '#CC4E00',
          },
          maroon: {
            DEFAULT: '#7A1521',
            dark: '#580E17',
            deep: '#450A10',
            50: '#FDF2F4',
            100: '#FCE7EA',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F5C542',
            dark: '#AA8822',
            50: '#FDFCF7',
          },
          obsidian: {
            DEFAULT: '#1A1412',
            light: '#2D2320',
          },
          earth: {
            DEFAULT: '#5C4E46',
            light: '#6B5E57',
          },
          champagne: {
            DEFAULT: '#EFE4D6',
            light: '#F8F3ED',
          },
          ivory: {
            DEFAULT: '#FAF8F5',
            pure: '#FFFFFF',
          },
          charcoal: {
            DEFAULT: '#1A1412',
            800: '#2D2320',
            900: '#1A1412',
          },
          warmborder: '#EFE4D6',
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