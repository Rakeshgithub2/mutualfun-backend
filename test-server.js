// Simple test server to verify port binding works
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check received');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Feedback endpoint
app.post('/api/feedback', (req, res) => {
  console.log('📬 Feedback received:', req.body);
  res.json({ success: true, message: 'Feedback received' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ message: 'Server is working!' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log(`✅ TEST SERVER RUNNING`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📍 http://127.0.0.1:${PORT}`);
  console.log('='.repeat(60));
  console.log('\nEndpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/test');
  console.log('  POST /api/feedback');
  console.log('\n🎯 Ready to accept connections!\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('Run: netstat -ano | findstr ":3002" to find the process');
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
