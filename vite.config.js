// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./", // 정적 배포 시 필수

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "icons/*.webp",
        "panels/*.webp",
      ],
      manifest: {
        name: "분청도자기 미션 챌린지",
        short_name: "Buncheong",
        start_url: ".", // 루트 상대경로
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3f51b5",
        icons: [
          { src: "./pwa-192x192.webp", sizes: "192x192", type: "image/webp" },
          { src: "./pwa-256x256.webp", sizes: "256x256", type: "image/webp" },
          { src: "./pwa-384x384.webp", sizes: "384x384", type: "image/webp" },
          { src: "./pwa-512x512.webp", sizes: "512x512", type: "image/webp" },
        ],
        screenshots: [
          {
            src: "./desktop.webp",
            sizes: "1280x720",
            type: "image/webp",
            form_factor: "wide",
          },
          {
            src: "./mobile.webp",
            sizes: "412x915",
            type: "image/webp",
            form_factor: "narrow",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  server: {
    host: true,
    port: 5173,
    allowedHosts: [".ngrok-free.app", ".trycloudflare.com"],
  },
});
