import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env variables (like VITE_API_URL, VITE_ACCOUNTS_URL)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy only works in dev mode
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
          secure: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
        "/accounts": {
          target: env.VITE_ACCOUNTS_URL,
          changeOrigin: true,
          secure: true,
          ws: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("accounts proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log("Sending Request to accounts:", req.method, req.url);
              // Add necessary headers
              proxyReq.setHeader("Origin", env.VITE_ACCOUNTS_URL);
              proxyReq.setHeader("Referer", env.VITE_ACCOUNTS_URL);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from accounts:",
                proxyRes.statusCode,
                req.url
              );
              // Add CORS headers to the response
              proxyRes.headers["Access-Control-Allow-Origin"] = "*";
              proxyRes.headers["Access-Control-Allow-Methods"] =
                "GET, POST, PUT, DELETE, PATCH, OPTIONS";
              proxyRes.headers["Access-Control-Allow-Headers"] =
                "X-Requested-With, content-type, Authorization, Accept, token";
              proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
            });
          },
        },
        "/products": {
          target: env.VITE_API_URL || "https://vhdev.onrender.com",
          changeOrigin: true,
          secure: true,
          ws: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("products proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log("Sending Request to products:", req.method, req.url);
              proxyReq.setHeader(
                "Origin",
                env.VITE_API_URL || "https://vhdev.onrender.com"
              );
              proxyReq.setHeader(
                "Referer",
                env.VITE_API_URL || "https://vhdev.onrender.com"
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from products:",
                proxyRes.statusCode,
                req.url
              );
              proxyRes.headers["Access-Control-Allow-Origin"] = "*";
              proxyRes.headers["Access-Control-Allow-Methods"] =
                "GET, POST, PUT, DELETE, PATCH, OPTIONS";
              proxyRes.headers["Access-Control-Allow-Headers"] =
                "X-Requested-With, content-type, Authorization, Accept, token";
              proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
            });
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
