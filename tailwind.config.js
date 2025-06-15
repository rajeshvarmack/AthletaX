/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],  theme: {
    extend: {
      colors: {
        'custom-purple': {
          light: '#4c1d95',   // Custom purple light
          medium: '#312e81',  // Custom purple medium  
          dark: '#1e1b4b',    // Custom purple dark
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.delay-500': {
          'animation-delay': '500ms',
        },
        '.delay-1000': {
          'animation-delay': '1000ms',
        },
        '.bg-grid-pattern': {
          'background-image':
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          'background-size': '30px 30px',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
