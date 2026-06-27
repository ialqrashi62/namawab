// ============================================================
// CANDIDATE ONLY — super-admin global audit_trail read route.
// NOT integrated into server.js, NOT deployed. Review/rehearsal artifact.
// Prereq: option B grant applied (GRANT nama_audit_reader TO nama_medical_app).
// Design: requireSuperAdmin gate + a dedicated pooled client + transaction-scoped
//   SET LOCAL ROLE nama_audit_reader (auto-resets at COMMIT/ROLLBACK — no leak),
//   parameterized safe filters, mandatory pagination, audit-metadata only.
// ============================================================

// --- middleware: strict super-admin gate (role==='Admin' is the super-admin here) ---
function requireSuperAdmin(req, res, next) {
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Super-admin only' });
  return next();
}

// --- route: cross-tenant audit read for super-admin, via the controlled reader role ---
// app.get('/api/admin/audit-trail/global', requireAuth, requireSuperAdmin, async (req, res) => { ... })
async function auditTrailGlobalHandler(req, res, pool, logAudit) {
  // pagination (mandatory, bounded)
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100); // default 50, hard cap 100
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  // safe filters only: date range / action / module / user_id — all parameterized, never raw SQL, never body tenant_id
  const conds = [];
  const params = [];
  if (req.query.date_from) { params.push(req.query.date_from); conds.push(`created_at >= $${params.length}`); }
  if (req.query.date_to)   { params.push(req.query.date_to);   conds.push(`created_at <= $${params.length}`); }
  if (req.query.action)    { params.push(String(req.query.action).slice(0, 64));  conds.push(`action = $${params.length}`); }
  if (req.query.module)    { params.push(String(req.query.module).slice(0, 64));  conds.push(`module = $${params.length}`); }
  if (req.query.user_id)   { params.push(parseInt(req.query.user_id, 10) || 0);   conds.push(`user_id = $${params.length}`); }
  const where = conds.length ? (' WHERE ' + conds.join(' AND ')) : '';
  params.push(limit); const limIdx = params.length;
  params.push(offset); const offIdx = params.length;

  // audit-metadata columns only (no over-exposure); ordered + paginated
  const sql = `SELECT id, created_at, user_id, username, action, module, ip_address, tenant_id
               FROM audit_trail${where} ORDER BY created_at DESC, id DESC
               LIMIT $${limIdx} OFFSET $${offIdx}`;

  // dedicated client; transaction-scoped SET LOCAL ROLE => auto-reset at COMMIT/ROLLBACK (no pool leak)
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL ROLE nama_audit_reader'); // cross-tenant read via role-scoped policy
    const rows = (await client.query(sql, params)).rows;
    await client.query('COMMIT'); // resets the SET LOCAL ROLE
    // record the privileged access itself (best-effort) — who read global audit, with what filters
    try { await logAudit(req.session.user.id, req.session.user.display_name, 'READ_GLOBAL_AUDIT', 'Admin',
      `limit=${limit} offset=${offset} filters=${JSON.stringify({ ...req.query, limit: undefined, offset: undefined })}`, req.ip); } catch (e) {}
    return res.json({ rows, limit, offset, count: rows.length });
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    return res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
}

module.exports = { requireSuperAdmin, auditTrailGlobalHandler };
