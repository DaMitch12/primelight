/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#141519',
        'nav-bg': '#1a1b20',
        'accent-blue': '#55b9f3',
        gradientStart: '#0a0b1e',
        gradientEnd: '#1c1e3b',
      },
      boxShadow: {
        nav: '0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'animated-gradient': 'linear-gradient(120deg, var(--tw-gradient-from), var(--tw-gradient-to), var(--tw-gradient-from), var(--tw-gradient-to))',
      },
      animation: {
        'gradient-move': 'gradientMove 15s ease infinite',
        'success-pop': 'successPop 0.3s ease-out forwards',
        'fade-out': 'fadeOut 2s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        successPop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' }
        }
      },
      fontFamily: {
        modern: ['Inter', 'sans-serif'],
      },
      zIndex: {
        '-10': '-10',
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '100%',
          '2xl': '100%',
        },
      },
      scale: {
        '85': '.85',
        '95': '.95',
      },
      transitionProperty: {
        'size': 'height, width',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};