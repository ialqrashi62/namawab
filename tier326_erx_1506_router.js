// tier326_erx_1506_router.js — e-Prescribing OUTBOX (local queue now; NPHIES/Wasl transmit activates with facility certificate)
const express = require('express');
const { query } = require('./db_postgres');
const eng = require('./tier326_erx_1506_engine.js');
const { ValidationError } = eng;
const fns = eng.funcs();
const r = express.Router();

function wrap(h) { return (req, res) => Promise.resolve(h(req, res)).catch(e => res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message })); }

r.post('/prescribe', wrap(async (req, res) => {
  const v = fns.validate_prescribe(req.body || {});
  const payload = { ...(req.body || {}) }; delete payload.tenant_id;
  const out = await query(
    `INSERT INTO erx_prescriptions (tenant_id, patient_ref, prescriber, drug_code, drug_name, dose, route, frequency, duration_days, status, payload)
     VALUES ($1::bigint,$2,$3,$4,$5,$6,$7,$8,$9,'queued',$10::jsonb)
     RETURNING id, status, created_at`,
    [v.tenant_id, v.patient_ref, v.prescriber, v.drug_code, v.drug_name, v.dose, v.route, v.frequency, v.duration_days, JSON.stringify(payload)]
  );
  res.json({ ok: true, result: out.rows[0] });
}));

r.post('/queue', wrap(async (req, res) => {
  const f = fns.validate_queue_filter(req.body || {});
  const out = await query(
    `SELECT id, patient_ref, prescriber, drug_code, drug_name, dose, route, frequency, duration_days, status, nphies_ref, created_at, transmitted_at
     FROM erx_prescriptions
     WHERE status = $1 AND tenant_id = $2::bigint
     ORDER BY created_at DESC LIMIT 50`,
    [f.status, f.tenant_id]
  );
  res.json({ ok: true, result: { items: out.rows, count: out.rows.length } });
}));

r.post('/mark_transmitted', wrap(async (req, res) => {
  const b = req.body || {};
  ensureTenant(b);
  if (!Array.isArray(b.ids) || b.ids.length === 0 || !b.ids.every(Number.isInteger)) throw new ValidationError('ids must be non-empty array of ints', 'ids');
  if (typeof b.nphies_ref !== 'string' || !b.nphies_ref) throw new ValidationError('nphies_ref must be string', 'nphies_ref');
  const out = await query(
    `UPDATE erx_prescriptions SET status='transmitted', nphies_ref=$1, transmitted_at=now()
     WHERE id=ANY($2::bigint[]) AND tenant_id=$3::bigint
     RETURNING id`,
    [b.nphies_ref, b.ids, b.tenant_id]
  );
  res.json({ ok: true, result: { updated: out.rows.length } });
}));

function ensureTenant(b) {
  if (typeof b.tenant_id !== 'string' || !/^\d+$/.test(b.tenant_id)) throw new ValidationError('tenant_id must be numeric string', 'tenant_id');
}

module.exports = r;
