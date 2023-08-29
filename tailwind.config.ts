import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            grayscale: {
                80: "80%"
            },
            backgroundImage: {
                'menu-icon': 'url(./img/menu-icon.png")',
                'chats': "url('./img/chats.png')",
            },
        },
    },
    plugins: [],
}
export default config
