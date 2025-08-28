// vite.config.ts — root = client, output to web-dist at repo root
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,

    // ✅ point aliases correctly
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    // ✅ tell Vite your app root and where to emit files
    root: path.resolve(__dirname, "client"),
    build: {
      // absolute path so we emit at repo root
      outDir: path.resolve(__dirname, "web-dist"),
      emptyOutDir: true,
    },

    // ✅ GitHub Pages base (workflow will set VITE_BASE to "/<repo>/")
    base: process.env.VITE_BASE ?? "/",

    server: {
      fs: { strict: true, deny: ["**/.*"] },
    },
  };
});
