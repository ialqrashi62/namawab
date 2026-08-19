'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_11_hl7_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'his-interop', timestamp: new Date().toISOString() }));

router.post('/hl7/parse', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.parseHL7v2(req.body.message || '') }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/hl7/adt', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  res.json({ ok: true, result: engine.buildHL7ADT(req.body) });
});

router.post('/hl7/oru', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  res.json({ ok: true, result: engine.buildHL7ORU(req.body) });
});

router.post('/dicom/c-store', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  res.json({ ok: true, result: engine.dicomCStore(req.body) });
});

router.post('/x12/eligibility', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  res.json({ ok: true, result: engine.eligibilityCheck(req.body) });
});

router.post('/x12/claim', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  res.json({ ok: true, result: engine.claimSubmissionX12(req.body) });
});

module.exports = router;