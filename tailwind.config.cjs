/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  daisyui: {
    themes: ["night"],
    darkTheme: "night",
  },

  plugins: [require("daisyui")],
};

module.exports = config;
