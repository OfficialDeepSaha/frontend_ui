/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          900: '#05060c',
          800: '#0b0f1a',
          700: '#0f1626',
          600: '#10182b',
        },
        accent: {
          500: '#8f7bff',
          400: '#b7a9ff',
        },
        mint: {
          400: '#4de1c6',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 20% 20%, rgba(79,124,255,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(77,225,198,0.12), transparent 30%), linear-gradient(135deg, rgba(15,22,38,0.9), rgba(12,16,28,0.9))',
      },
    },
  },
  plugins: [],
};
