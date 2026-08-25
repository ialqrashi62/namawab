// tier323_cdss_1504_router.js — unified evaluate dispatch over verified engines
const express = require('express');
const path = require('path');
const { REGISTRY, cdss_catalog, validate_evaluate, ValidationError } = require('./tier323_cdss_1504_engine.js');
const r = express.Router();

r.post('/catalog', (req, res) => res.json({ ok: true, result: cdss_catalog() }));

r.post('/evaluate', async (req, res) => {
  try {
    const { rule, params } = validate_evaluate(req.body || {});
    const entry = REGISTRY[rule];
    const mod = require(path.join(__dirname, entry.module));
    const fn = mod.funcs()[entry.fn];
    if (!fn) return res.status(500).json({ ok: false, error: `registry fn missing: ${entry.fn}` });
    const result = fn({ tenant_id: req.body.tenant_id, ...params });
    res.json({ ok: true, result: { rule, citation: entry.citation, output: result } });
  } catch (e) {
    res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message });
  }
});

module.exports = r;
