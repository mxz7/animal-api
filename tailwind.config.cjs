/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  daisyui: {
    themes: ["night"],
  },

  theme: {
    extend: {
      colors: {
        // text: "#f4e6e9",
        // background: "#1b080c",
        // primary: "#EC3C62",
        // secondary: "#8c172e",
        // accent: "#E68EA0",
      },
    },
  },

  plugins: [require("daisyui")],
};

module.exports = config;
