/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
      'text-gray-800',
      'text-gray-500',
      'text-gray-700',
      'text-gray-900',
    ],
    theme: {
      extend: {
        colors: {
          indigo: {
            50: '#f0f5ff',
            100: '#e5edff',
            200: '#cddbfe',
            300: '#b4c6fc',
            400: '#8da2fb',
            500: '#6875f5',
            600: '#5850ec',
            700: '#5145cd',
            800: '#42389d',
            900: '#362f78',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712',
          },
        },
      },
    },
    plugins: [],
  }