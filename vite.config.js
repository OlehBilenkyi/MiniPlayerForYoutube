import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/MiniPlayerForYoutube/", // Match your repository name exactly
  optimizeDeps: {
    include: ["rxjs/internal/BehaviorSubject"],
  },
});
