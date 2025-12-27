/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        surface: {
          950: '#020408',
          900: '#050a14',
          800: '#0b1221',
          700: '#15203b',
          600: '#1f2e51',
        },
        accent: {
          300: '#d0c7ff',
          400: '#a795ff',
          500: '#8f7bff',
          600: '#7c66ff',
        },
        mint: {
          300: '#7fffd4',
          400: '#4de1c6',
          500: '#2ac4a6',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.03)',
          200: 'rgba(255, 255, 255, 0.07)',
          300: 'rgba(255, 255, 255, 0.12)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 15% 15%, rgba(143, 123, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 85% 15%, rgba(77, 225, 198, 0.12) 0%, transparent 40%)',
        'card-gradient': 'linear-gradient(145deg, rgba(11, 18, 33, 0.8), rgba(5, 10, 20, 0.9))',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(143, 123, 255, 0.15)',
        'glow-hover': '0 0 60px -15px rgba(143, 123, 255, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};