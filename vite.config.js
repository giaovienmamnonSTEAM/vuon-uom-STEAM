import { defineConfig, loadEnv } from 'vite';

// Cho phép `npm run dev` chạy luôn route /api/generate (giống Vercel),
// đọc GEMINI_API_KEY từ file .env.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const k of ['GEMINI_API_KEY', 'GEMINI_MODEL', 'GEMINI_API_BASE']) {
        if (env[k] && !process.env[k]) process.env[k] = env[k];
      }
      server.middlewares.use('/api/generate', async (req, res) => {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
        const { default: handler } = await server.ssrLoadModule('/api/generate.js');
        await handler(req, res);
      });
    }
  };
}

export default defineConfig({
  plugins: [localApi()],
  server: { port: 5173 },
  build: { outDir: 'dist' }
});
