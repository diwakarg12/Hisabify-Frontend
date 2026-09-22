
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/profile': 'http://localhost:3000',
      '/group': 'http://localhost:3000',
      '/invite': 'http://localhost:3000',
      '/expense': 'http://localhost:3000',
      '/message': 'http://localhost:3000',
      '/notification': 'http://localhost:3000',
    },
  },
});
