/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  daisyui: {
    themes: ["winter", "night"],
    darkTheme: "night",
  },

  plugins: [require("daisyui")],
};

module.exports = config;
