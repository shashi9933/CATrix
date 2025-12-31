/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#1976d2',
                    DEFAULT: '#1976d2',
                    dark: '#1565c0',
                },
                secondary: {
                    light: '#dc004e',
                    DEFAULT: '#dc004e',
                    dark: '#c51162',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
    // Disable Tailwind's preflight to avoid conflicts with Material-UI
    corePlugins: {
        preflight: false,
    },
} 