// Cho trình duyệt biết máy chủ đã cấu hình AI chưa (không trả về API key).
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(
    JSON.stringify({
      connected: Boolean(process.env.ANTHROPIC_API_KEY),
      needsCode: Boolean(process.env.APP_ACCESS_CODE),
      provider: 'Claude (Anthropic)'
    })
  );
}
