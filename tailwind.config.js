/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#002a5e',
        cyan: '#2596be',
        'strong-blue': '#1890ff',
        blue: '#0073CF',
        'sky-blue': '#A8CFEB',
        'light-purple': '#4F5172',
        'dark-purple': '#2B3674',
        'light-blue': '#69B2E8',
        out_of_date: '#050505',
        finalized: '#828282',
        more_6_months: '#76BD43',
        less_6_months: '#FFB81C',
        less_3_months: '#E3002B',
        undefined: 'rgb(129, 71, 174)',
        purple: '#9B51E0',
        'dark-cyan': '#1F9B9C',
        pink: '#E25266',
        orange: '#FF6B38',
        'gray-light': '#BABABA'
      }
    }
  },
  plugins: []
}
