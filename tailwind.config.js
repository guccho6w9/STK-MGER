/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le dice a Tailwind que busque las clases en el directorio `src/app`
  // y en cualquier subdirectorio dentro de él.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
