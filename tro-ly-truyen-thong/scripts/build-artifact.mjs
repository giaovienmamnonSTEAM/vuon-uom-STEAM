// Đóng gói ứng dụng thành MỘT tệp HTML để đăng làm Artifact trên claude.ai.
// Chạy: npm run build:artifact  →  artifact/tro-ly-truyen-thong.html
// CSS và JS được nhúng thẳng vào trang (khung Artifact chỉ cho tải script từ vài CDN).
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'node_modules/.artifact-build');

await build({
  root,
  base: './',
  logLevel: 'warn',
  build: { outDir, emptyOutDir: true, assetsInlineLimit: 100000, cssCodeSplit: false, modulePreload: false }
});

const assets = path.join(outDir, 'assets');
const files = fs.readdirSync(assets);
const js = files.filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
const css = files.filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
const safeJs = js.replace(/<\/script/gi, '<\\/script');

// Không có <!doctype>/<html>/<head>/<body>: claude.ai tự bọc khung trang khi đăng.
const html = `<title>Trợ lý Truyền thông Mầm non</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap">
<style>
:root{color-scheme:light}
${css}
</style>
<div id="root"></div>
<script type="module">
${safeJs}
</script>
`;

const dest = path.join(root, 'artifact', 'tro-ly-truyen-thong.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, html);
console.log(`Đã tạo ${path.relative(root, dest)} (${(html.length / 1024).toFixed(0)} KB)`);
