/**
 * pcc/picu/picu_routes.js
 * 5 Express endpoints for picu.
 */
'use strict';
const { Router } = require('express');
const Engine = require('./picu_engine');
const router = Router();
function authenticate(req, res, next) {
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  const role = req.header('x-pcc-role') || 'PICU';
  if (!userId || !tenantId) return res.status(401).json({ error: 'missing auth' });
  if (role !== 'PICU') return res.status(403).json({ error: 'PICU role required' });
  req.session = { userId: parseInt(userId, 10), tenantId, role };
  next();
}
router.post('/admissions', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, tenantId: req.session.tenantId, ...req.body, status: 'admitted' });
});
router.get('/admissions', authenticate, async (_req, res) => { res.json([]); });
router.get('/admissions/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, admission: { id: req.params.id } });
});
router.post('/admissions/:id/vitals', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, admissionId: req.params.id });
});
router.get('/decision/apache', authenticate, async (req, res) => {
  // Generic: just return a stub decision
  res.json({ decision: 'apache', score: 0, module: 'picu' });
});
module.exports = router;