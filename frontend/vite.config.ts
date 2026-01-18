import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    TanStackRouterVite(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "compass-icon.svg"],
      manifest: {
        name: "Gentle Disagree",
        short_name: "Gentle Disagree",
        description:
          "A privacy-focused app for constructive conflict resolution using Soft Startups",
        theme_color: "#5B8C6A", // Sage green
        background_color: "#FDF9F3", // Cream
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        categories: ["health", "lifestyle"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // AI API calls: Network First (with fallback)
            urlPattern: /^https?:\/\/.*\/ai\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "ai-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 3600 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Images: Cache First
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 2592000 },
            },
          },
          {
            // Google Fonts: Cache First
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5200,
    host: "0.0.0.0",
  },
});
