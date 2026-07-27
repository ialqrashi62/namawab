/**
 * pcc/nnicu/nnicu_routes.js
 * 5 Express endpoints for NNICU.
 */
'use strict';

const { Router } = require('express');
const Engine = require('./nnicu_engine');

const router = Router();

const NNICU_TENANT_ROLE = ['NNICU_AUTH_STUB', 'NNICU_TENANT_STUB', 'NNICU_ROLE_STUB'];

/* Stub middleware for PCC sandbox (real auth wiring in production) */
function authenticate(req, res, next) {
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  const role = req.header('x-pcc-role') || 'NNICU';
  if (!userId || !tenantId) return res.status(401).json({ error: 'missing auth' });
  if (role !== 'NNICU') return res.status(403).json({ error: 'NNICU role required' });
  req.session = { userId: parseInt(userId, 10), tenantId, role };
  next();
}

/* 1. POST /admissions (idempotent) */
router.post('/admissions', authenticate, async (req, res) => {
  // For PCC: return a stub with id; production would use withTenant + INSERT
  const id = require('crypto').randomUUID();
  res.status(201).json({
    id, tenantId: req.session.tenantId, ...req.body,
    status: 'admitted', admittedAt: new Date().toISOString(),
  });
});

/* 2. GET /admissions */
router.get('/admissions', authenticate, async (req, res) => {
  res.json([]);
});

/* 3. GET /admissions/:id */
router.get('/admissions/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, admission: { id: req.params.id }, doses: [] });
});

/* 4. POST /admissions/:id/doses (idempotent) */
router.post('/admissions/:id/doses', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, admissionId: req.params.id });
});

/* 5. GET /decision/apgar (pure compute) */
router.get('/decision/apgar', authenticate, async (req, res) => {
  const { appearance, pulse, grimace, activity, respiration } = req.query;
  try {
    const r = Engine.ApgarScore({
      appearance: parseInt(appearance, 10),
      pulse: parseInt(pulse, 10),
      grimace: parseInt(grimace, 10),
      activity: parseInt(activity, 10),
      respiration: parseInt(respiration, 10),
    });
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
