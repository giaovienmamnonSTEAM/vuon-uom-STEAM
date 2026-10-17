/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f2f8fd', 100: '#e3f0fb', 200: '#c6e2f6', 300: '#9dcdef',
          400: '#6fb3e4', 500: '#4a97d4', 600: '#357bb7', 700: '#2c6394', 800: '#284f74', 900: '#223f5c'
        },
        kem: '#fffaf0',
        vang: '#fde9a8',
        dao: '#fdcfb4',
        la: '#cfeccf'
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
