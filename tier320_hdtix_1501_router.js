// filepath: tier320_hdtix_1501_router.js
const express = require('express');
const router = express.Router();
const { query } = require('./db_postgres');
const { funcs, ValidationError } = require('./tier320_hdtix_1501_engine');

function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }

router.post('/open', asyncH(async (req, res) => {
  try {
    const v = funcs().validate_open(req.body || {});
    const r = await query(
      'INSERT INTO helpdesk_tickets (tenant_id, requester, severity, subject, sla_due_minutes) VALUES ($1::uuid,$2,$3,$4,$5) RETURNING id, opened_at',
      [v.tenant_id, v.requester, v.severity, v.subject, v.sla_due_minutes]
    );
    res.json({ ok: true, result: { id: r.rows[0].id, ...v } });
  } catch (e) {
    if (e instanceof ValidationError) return res.status(400).json({ ok: false, error: e.message, field: e.field });
    throw e;
  }
}));

router.post('/triage', asyncH(async (req, res) => {
  try {
    const v = funcs().validate_triage(req.body || {});
    const r = await query(
      "UPDATE helpdesk_tickets SET queue=$3, status=CASE WHEN $4='resolve' THEN 'resolved' ELSE 'triaged' END WHERE id=$2::bigint AND tenant_id=current_setting('app.tenant_id',true)::uuid RETURNING id, queue, status",
      ['-', v.ticket_id, v.next_queue, v.action]
    );
    if (!r.rows.length) return res.status(404).json({ ok: false, error: 'not found' });
    res.json({ ok: true, result: r.rows[0] });
  } catch (e) {
    if (e instanceof ValidationError) return res.status(400).json({ ok: false, error: e.message, field: e.field });
    throw e;
  }
}));

router.post('/summary', asyncH(async (req, res) => {
  try {
    const r = await query(
      "SELECT severity, count(*)::int AS c, count(closed_at)::int AS closed FROM helpdesk_tickets WHERE tenant_id=current_setting('app.tenant_id',true)::uuid GROUP BY severity"
    );
    res.json({ ok: true, result: { by_severity: r.rows } });
  } catch (e) {
    throw e;
  }
}));

module.exports = router;
