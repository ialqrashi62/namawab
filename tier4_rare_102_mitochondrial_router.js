'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_102_mitochondrial_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-mito' }));
router.post('/evaluate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mitochondrialDiseaseEvaluation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/melas-stroke', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.strokeLikeEpisodeMELAS(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/kearns-sayre', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.kearnsSayreSurveillance(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/lhon', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.lhonManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/exercise-safety', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.exerciseMitochondrialSafety(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
