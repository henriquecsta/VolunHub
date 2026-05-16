/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#f8f4ed',
          100: '#efe6d9',
          200: '#e2d2bc',
        },
        clay: {
          100: '#f4ddd2',
          200: '#ebc2ae',
          500: '#ba6b45',
          600: '#a55532',
          700: '#864228',
        },
        forest: {
          100: '#dce8e1',
          500: '#2f6b4f',
          600: '#25553f',
          700: '#1d4332',
        },
        ink: {
          900: '#1f2522',
        },
        mist: {
          100: '#f4f7f5',
          200: '#e6ece7',
          300: '#c7d5cb',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(31, 37, 34, 0.08)',
      },
      fontFamily: {
        body: ['"Source Sans 3"', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(186, 107, 69, 0.18), transparent 38%), linear-gradient(135deg, #f8f4ed 0%, #f4f7f5 100%)',
      },
    },
  },
  plugins: [],
};
