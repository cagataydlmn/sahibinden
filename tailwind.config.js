/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Tailwind'in hangi dosyalar üzerinde çalışacağını belirtir
  ],
  theme: {
    extend: {
      colors: {
        customGray: 'rgb(217, 217, 217)',
        anaRenk1: 'rgba(0, 188, 255, 1)',
        anaRenk2: 'rgba(255, 230, 255, 1)',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Preflight'ı devre dışı bırak
  },
}
