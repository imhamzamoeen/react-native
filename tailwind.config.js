/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark': '#181A24',
        'light': '#fff',
        'light-background': '#F7F7F9',
        'dark-background': '#000'
      },
      fontFamily: {
        REGULAR: "Poppins_400Regular",
        REGULAR_ITALIC: "Poppins_400Regular_Italic",
        MEDIUM: "Poppins_500Medium",
        MEDIUM_ITALIC: "Poppins_500Medium_Italic",
        SEMIBOLD: "Poppins_600SemiBold",
        SEMIBOLD_ITALIC: "Poppins_600SemiBold_Italic",
        BOLD: "Poppins_700Bold",
        BOLD_ITALIC: "Poppins_700Bold_Italic",
      }
    },
  },
  plugins: [],
}

