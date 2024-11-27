/** @type {import('tailwindcss').Config} */ 

module.exports = {
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '8rem',
        '2xl': '12rem',
      },
    },
    extend: {
      colors: {
        // UI
        'primary': '#40539E',        // Azul oscuro
        'primary-light': '#7D8CCB',  // Azul acero
        'secondary': '#F37042',      // Naranja vibrante
        'secondary-light': '#F37042',// Naranja vibrante
        'background': '#F5F5F5',     // Blanco humo
        'decoration': '#F8F8FC',     // Gris perla
        'text': '#4B5563',           // Gris grafito
        // Status
        'error': '#B91C1C',          // Rojo oscuro para errores
        'warning': '#D97706',        // Naranja para advertencias
        'success': '#15803D',        // Verde oscuro para éxitos
      },
      fontFamily: {
        'roboto': ['Roboto', ],
        'roboto-condensed': ['RobotoCondensed', ],
      }
    },
  },
  plugins: [],
}