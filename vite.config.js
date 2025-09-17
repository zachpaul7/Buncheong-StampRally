// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        // ✅ 여기 precache할 이미지 전부 넣기
        "icons/*.png",
        "panels/*.png",
      ],
      manifest: {
        name: "분청도자기 미션 챌린지",
        short_name: "Buncheong",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3f51b5",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
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
