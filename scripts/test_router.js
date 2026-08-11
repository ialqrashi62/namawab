const express = require('express');
const app = express();
try {
  const r = require('./cardiology_router');
  console.log('router type:', typeof r);
  console.log('router.stack length:', r && r.stack ? r.stack.length : 'n/a');
  app.use('/api/cardiology', r);
  console.log('mounted OK');
  const server = app.listen(3300, () => {
    const http = require('http');
    http.get('http://127.0.0.1:3300/api/cardiology/assessments/grace', (res) => {
      console.log('GET status:', res.statusCode);
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => { console.log('body:', body.slice(0, 200)); server.close(); });
    }).on('error', (e) => { console.error('GET error:', e.message); server.close(); });
  });
} catch (e) {
  console.error('FAIL:', e.message, e.stack);
}
