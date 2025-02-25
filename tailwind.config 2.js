/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Tailwind'in hangi dosyalar üzerinde çalışacağını belirtir
  ],
  theme: {
    extend: {
      colors: {
        customGray: 'rgb(246, 246, 246)', // İstediğiniz RGB değerini buraya yazın
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Preflight'ı devre dışı bırak
  },
}
