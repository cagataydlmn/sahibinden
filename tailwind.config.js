/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Tailwind'in hangi dosyalar üzerinde çalışacağını belirtir
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Preflight'ı devre dışı bırak
  },
}
