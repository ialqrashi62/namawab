'use strict';
/**
 * TIER3_PULM-301 COPD Router
 * Mount: /api/copd
 */
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_pulm_301_copd_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'tier3-copd', version: '1.0.0', timestamp: new Date().toISOString() }));
router.post('/gold-stage', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => { try { res.json({ ok: true, result: engine.goldStaging(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } });
router.post('/exacerbation', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => { try { res.json({ ok: true, result: engine.exacerbationSeverity(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } });
router.post('/adherence', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => res.json({ ok: true, result: engine.inhalerAdherence(req.body) }));
router.post('/oxygen', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.oxygenTherapy(req.body) }));
router.post('/rehab', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.pulmonaryRehab(req.body) }));
router.post('/vaccination', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => res.json({ ok: true, result: engine.vaccinationPlan(req.body) }));
module.exports = router;