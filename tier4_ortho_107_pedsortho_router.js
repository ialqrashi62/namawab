'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_107_pedsortho_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-peds' }));
router.post('/ddh', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ddhManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/clubfoot', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.clubfoot(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/scfe', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.scfeManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
