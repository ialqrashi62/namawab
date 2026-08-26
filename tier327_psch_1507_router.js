// tier327_psch_1507_router.js — Patient Self-Service Scheduling (portal phase-1)
// Writes ONLY to staging table portal_bookings; staff confirm/reject later. Never touches core appointments.
const express = require('express');
const { query } = require('./db_postgres');
const eng = require('./tier327_psch_1507_engine.js');
const { ValidationError } = eng;
const f = eng.funcs();
const r = express.Router();

function wrap(h) { return (req, res) => Promise.resolve(h(req, res)).catch(e => res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message })); }
function ensureTenantStr(b) {
  if (typeof b.tenant_id !== 'string' || !/^\d+$/.test(b.tenant_id)) throw new ValidationError('tenant_id must be numeric string', 'tenant_id');
}

r.post('/book', wrap(async (req, res) => {
  const v = f.validate_booking(req.body || {});
  ensureTenantStr(req.body || {});
  const tid = req.body.tenant_id;
  const { rows: conflictRows } = await query(
    `SELECT count(*)::int AS c FROM portal_bookings
      WHERE tenant_id = $1::bigint
        AND doctor_name = $2 AND preferred_date = $3 AND preferred_time = $4
        AND status IN ('pending','confirmed')`,
    [tid, v.doctor_name, v.preferred_date, v.preferred_time]);
  if (f.decision(conflictRows[0].c) !== 'slot_available') {
    return res.status(409).json({ ok: false, error: 'slot_taken_choose_another' });
  }
  const { rows } = await query(
    `INSERT INTO portal_bookings (tenant_id, patient_name, phone, doctor_name, department, preferred_date, preferred_time, status)
     VALUES ($1::bigint, $2, $3, $4, $5, $6, $7, 'pending')
     RETURNING id, created_at`,
    [tid, v.patient_name, v.phone, v.doctor_name, v.department, v.preferred_date, v.preferred_time]);
  res.json({ ok: true, result: rows[0] });
}));

r.post('/staff_confirm', wrap(async (req, res) => {
  const b = req.body || {};
  ensureTenantStr(b);
  if (!Array.isArray(b.ids) || b.ids.length === 0 || !b.ids.every(x => /^\d+$/.test(String(x)))) {
    throw new ValidationError('ids[] must be an array of bigint ids', 'ids');
  }
  if (!['confirm', 'reject'].includes(b.action)) {
    throw new ValidationError('action must be one of confirm|reject', 'action');
  }
  const nextStatus = b.action === 'confirm' ? 'confirmed' : 'rejected';
  const { rows } = await query(
    `UPDATE portal_bookings SET status = $2
      WHERE id = ANY($1::bigint[]) AND tenant_id = $3::bigint
      RETURNING id`,
    [b.ids.map(String), nextStatus, b.tenant_id]);
  res.json({ ok: true, result: { updated: rows.length } });
}));

r.post('/my_bookings', wrap(async (req, res) => {
  const b = req.body || {};
  ensureTenantStr(b);
  const params = [b.tenant_id];
  let where = 'tenant_id = $1::bigint';
  if (b.phone) { params.push(b.phone); where += ` AND phone = $${params.length}`; }
  if (b.doctor_name) { params.push(b.doctor_name); where += ` AND doctor_name = $${params.length}`; }
  const { rows } = await query(
    `SELECT id, patient_name, doctor_name, department, preferred_date, preferred_time, status, created_at
     FROM portal_bookings WHERE ${where} ORDER BY created_at DESC LIMIT 20`, params);
  res.json({ ok: true, result: { items: rows, count: rows.length } });
}));

module.exports = r;
