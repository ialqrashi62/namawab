// filepath: tier321_apmstore_1502_router.js
const express = require('express');
const router = express.Router();
const { query } = require('./db_postgres');
const { funcs, ValidationError } = require('./tier321_apmstore_1502_engine');

function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }

router.post('/latency', asyncH(async (req, res) => {
  try {
    const v = funcs().validate_latency(req.body || {});
    const r = await query(
      'INSERT INTO apm_metrics (tenant_id, kind, route, value_num, meta) VALUES ($1::uuid,$2,$3,$4,$5::jsonb) RETURNING id',
      [v.tenant_id, v.kind, v.route, v.value_num, JSON.stringify({ band: v.band })]
    );
    res.json({ ok: true, result: { id: r.rows[0].id, band: v.band } });
  } catch (e) {
    if (e instanceof ValidationError) return res.status(400).json({ ok: false, error: e.message, field: e.field });
    throw e;
  }
}));

router.post('/llm_trace', asyncH(async (req, res) => {
  try {
    const v = funcs().validate_llm_trace(req.body || {});
    const r = await query(
      'INSERT INTO apm_metrics (tenant_id, kind, route, value_num, meta) VALUES ($1::uuid,$2,$3,$4,$5::jsonb) RETURNING id',
      [v.tenant_id, v.kind, null, v.value_num, JSON.stringify(v.meta)]
    );
    res.json({ ok: true, result: { id: r.rows[0].id, ...v.meta } });
  } catch (e) {
    if (e instanceof ValidationError) return res.status(400).json({ ok: false, error: e.message, field: e.field });
    throw e;
  }
}));

router.post('/summary', asyncH(async (req, res) => {
  try {
    const r = await query(
      "SELECT kind, count(*)::int AS c, round(avg(value_num)::numeric,1) AS avg_v FROM apm_metrics WHERE tenant_id=current_setting('app.tenant_id',true)::uuid GROUP BY kind"
    );
    res.json({ ok: true, result: { by_kind: r.rows } });
  } catch (e) {
    throw e;
  }
}));

module.exports = router;
