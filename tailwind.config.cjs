import catppuccin from "@catppuccin/daisyui";

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  daisyui: {
    themes: [catppuccin("mocha")],
  },

  plugins: [require("daisyui")],
};

module.exports = config;
