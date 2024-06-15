import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'storm': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#606060',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#262626',
        },
        'maroon': {
          '50': '#ffeeee',
          '100': '#ffdada',
          '200': '#ffbbbb',
          '300': '#ff8b8b',
          '400': '#ff4949',
          '500': '#ff1111',
          '600': '#ff0000',
          '700': '#e70000',
          '800': '#be0000',
          '900': '#860000',
          '950': '#560000',
        },
        'biscay': {
          '50': '#eff8ff',
          '100': '#dbeffe',
          '200': '#bfe4fe',
          '300': '#94d4fc',
          '400': '#61bbf9',
          '500': '#3c9df5',
          '600': '#2780e9',
          '700': '#1e6ad7',
          '800': '#1f56ae',
          '900': '#1f4989',
          '950': '#193159',
        },
        'seagreen': {
          '50': '#f2fbfa',
          '100': '#d2f5f4',
          '200': '#a5eae8',
          '300': '#70d7d8',
          '400': '#42bbbf',
          '500': '#299ca3',
          '600': '#1e7c83',
          '700': '#1c6369',
          '800': '#1d555b',
          '900': '#1b4246',
          '950': '#09262a',
        },
        'lima': {
          '50': '#f6fce9',
          '100': '#ecf8cf',
          '200': '#d8f2a4',
          '300': '#bde76f',
          '400': '#a2d843',
          '500': '#88c426',
          '600': '#659719',
          '700': '#4d7318',
          '800': '#3f5c18',
          '900': '#374e19',
          '950': '#1b2b08',
        }
      },
      boxShadow: {
        'small': '0 4px 4px 2px rgba(0, 0, 0, 0.25)',
        'medium': '0 2px 8px 0px rgba(255, 255, 255, 0.75)',
      }
    },
  },
  plugins: [],
};
export default config;
