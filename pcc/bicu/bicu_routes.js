/**
 * pcc/bicu/bicu_routes.js
 * 5 Express endpoints for BICU.
 */
'use strict';

const { Router } = require('express');
const Engine = require('./bicu_engine');

const router = Router();

function authenticate(req, res, next) {
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  const role = req.header('x-pcc-role') || 'BICU';
  if (!userId || !tenantId) return res.status(401).json({ error: 'missing auth' });
  if (role !== 'BICU') return res.status(403).json({ error: 'BICU role required' });
  req.session = { userId: parseInt(userId, 10), tenantId, role };
  next();
}

router.post('/admissions', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, tenantId: req.session.tenantId, ...req.body, status: 'admitted' });
});

router.get('/admissions', authenticate, async (_req, res) => { res.json([]); });

router.get('/admissions/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, admission: { id: req.params.id }, fluidBalance: [] });
});

router.post('/admissions/:id/fluid', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, admissionId: req.params.id });
});

router.get('/decision/parkland', authenticate, async (req, res) => {
  try {
    const r = Engine.ParklandFormula({
      weightKg: parseFloat(req.query.weightKg),
      tbsaPct: parseFloat(req.query.tbsaPct),
      hoursSinceBurn: parseInt(req.query.hoursSinceBurn || '8', 10),
    });
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
