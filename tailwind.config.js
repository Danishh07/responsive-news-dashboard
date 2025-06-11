/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable class-based dark mode toggle
  darkMode: 'class',
  
  // Scan these files for Tailwind classes
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      colors: {
        // Custom primary color palette for consistent branding
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        // Custom font stack with Geist as primary
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      screens: {
        // Extra small breakpoint for better mobile responsiveness
        'xs': '475px',
      },
    },
  },
  plugins: [
    // Enhanced form styling plugin
    require('@tailwindcss/forms'),
  ],
};
