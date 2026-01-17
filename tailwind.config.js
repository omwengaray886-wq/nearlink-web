/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Safety net to catch all files
  ],
  theme: {
    extend: {
      colors: {
        nearlink: {
          DEFAULT: '#00A699', // Your Main Brand Color (Teal)
          dark: '#008489',    // Hover state
          light: '#E0F7F6',   // Background accents
          accent: '#FFD700',  // Gold for ratings
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // ✅ ADDED: Animations for Hero and Notifications
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slow-pan': 'panImage 30s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate(-50%, -20px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        panImage: {
          '0%': { transform: 'scale(1.1) translate(0%, 0%)' },
          '50%': { transform: 'scale(1.1) translate(-2%, -2%)' },
          '100%': { transform: 'scale(1.1) translate(0%, 0%)' },
        }
      }
    },
  },
  plugins: [],
};