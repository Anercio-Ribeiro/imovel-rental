// src/lib/tailwind-animate-stub.js
// This is a minimal stub for tailwindcss-animate
// In production, install: npm install tailwindcss-animate
module.exports = function ({ addUtilities, matchUtilities, theme }) {
  addUtilities({
    ".animate-in": { animationDuration: "200ms", animationFillMode: "both" },
    ".animate-out": { animationDuration: "200ms", animationFillMode: "both" },
    ".fade-in-0": { "--tw-enter-opacity": "0" },
    ".fade-out-0": { "--tw-exit-opacity": "0" },
    ".zoom-in-95": { "--tw-enter-scale": ".95" },
    ".zoom-out-95": { "--tw-exit-scale": ".95" },
    ".slide-in-from-top-2": { "--tw-enter-translate-y": "-0.5rem" },
    ".slide-in-from-bottom-2": { "--tw-enter-translate-y": "0.5rem" },
    ".slide-in-from-left-1\\/2": { "--tw-enter-translate-x": "-50%" },
    ".slide-out-to-left-1\\/2": { "--tw-exit-translate-x": "-50%" },
    ".slide-out-to-top-\\[48\\%\\]": { "--tw-exit-translate-y": "-48%" },
    ".slide-in-from-top-\\[48\\%\\]": { "--tw-enter-translate-y": "-48%" },
  });
};
