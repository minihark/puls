const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static assets from dist
app.use(express.static(DIST_DIR));

// Health check endpoint for Coolify
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Puls',
    version: '1.0.0',
    protocol: 'XRPL Consensus & Adoption Monitor',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for client-side SPA routing
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Puls] XRPL Telemetry Monitor running on http://0.0.0.0:${PORT}`);
});
