/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          background: {
            primary: '#F8F8F8',
            surface: '#FFFFFF'
          },
          primary: {
            medium: '#4F772D',
            deep: '#2E7D32'
          },
          secondary: {
            medium: '#90A955',
            deep: '#4F772D'
          },
          accent: '#E6B566',
          success: '#2E7D32',
          warning: '#E6B566',
          danger: '#E53935',
          info: '#90A955',
          text: {
            primary: '#2F2F2F',
            secondary: '#666666'
          }
        },
        fontSize: {
          'xs': '10px',
          'sm': '12px',
          'base': '14px',
          'lg': '16px',
          'xl': '18px',
          '2xl': '20px',
          '3xl': '24px',
          '4xl': '28px',
        }
      }
    },
    plugins: [],
  }