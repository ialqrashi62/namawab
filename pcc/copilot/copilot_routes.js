/**
 * pcc/copilot/copilot_routes.js
 * 1 endpoint: POST /ask (LLM co-pilot with citation).
 */
'use strict';

const { Router } = require('express');
const Copilot = require('./llm_copilot');

const router = Router();

function authenticate(req, res, next) {
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  if (!userId || !tenantId) return res.status(401).json({ error: 'missing auth' });
  req.session = { userId: parseInt(userId, 10), tenantId };
  next();
}

router.post('/ask', authenticate, async (req, res) => {
  const { prompt } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt is required' });
  }
  const response = Copilot.ask(prompt);
  res.json({
    prompt: prompt.slice(0, 200),
    response,
    tenantId: req.session.tenantId,
    ts: new Date().toISOString(),
  });
});

router.get('/topics', authenticate, (_req, res) => {
  res.json({ topics: Copilot.getAllTopics() });
});

module.exports = router;
