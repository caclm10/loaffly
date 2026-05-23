import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "inline",
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon-180x180.png",
                "apple-touch-startup-image.png",
                "pwa-64x64.png",
                "pwa-192x192.png",
                "pwa-512x512.png",
                "maskable-icon-512x512.png",
                "logo.svg",
            ],
            manifest: {
                name: "Loaffly",
                short_name: "Loaffly",
                description:
                    "Loaffly is a modern, beautiful personal finance application.",
                theme_color: "#0f0f11",
                background_color: "#0f0f11",
                display: "standalone",
                orientation: "portrait-primary",
                icons: [
                    {
                        src: "/logo.svg",
                        sizes: "any",
                        type: "image/svg+xml",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/maskable-icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2}"],
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
