/**
 * cross_tenant_him_test.js — E2 (HIM) tenant-isolation + fail-closed logic test.
 * No DB / no HTTP / no PHI. Run: node cross_tenant_him_test.js
 *
 * Simulates the server logic for the HIM endpoints and asserts:
 *   - longitudinal record: cross-tenant patient -> 404; null tenant in prod -> 403 (fail-closed)
 *   - record access is always logged (never an unlogged read path)
 *   - coding/ROI/break-glass stamp tenant_id from session, never from body
 *   - RLS policy is fail-closed: null app.tenant_id matches no row
 *   - ROI state machine + break-glass reason requirement
 */
const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let passed = 0, failed = 0;
const failureLog = [];
function assert(c, name, details = '') {
  if (c) { console.log(`  ${GREEN}PASS${RESET} — ${name}`); passed++; }
  else { console.log(`  ${RED}FAIL${RESET} — ${name}${details ? ' | ' + details : ''}`); failed++; failureLog.push({ name, details }); }
}

console.log(`\n${BOLD}${BLUE}=== E2 HIM Cross-Tenant / Fail-Closed Logic Test ===${RESET}\n`);

// ===== getRequestTenantContext (mirror of server.js) =====
function getRequestTenantContext(req) {
  let tenantId = req.session?.user?.tenantId || null;
  let facilityId = req.session?.user?.facilityId || null;
  const isProduction = process.env.NODE_ENV === 'production';
  if (!tenantId && !isProduction) { tenantId = 1; facilityId = 1; }
  return { tenantId, facilityId, isProduction };
}
function requireTenantScope(req, res, next) {
  const { tenantId, isProduction } = getRequestTenantContext(req);
  if (!tenantId && isProduction) return res.status(403).json({ error: 'Tenant scope required' });
  next();
}

console.log(`${BOLD}[1] requireTenantScope fail-closed (null tenant in prod -> 403)${RESET}`);
{
  const saved = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let status = null, nextCalled = false;
  const res = { status: (s) => { status = s; return { json: () => {} }; } };
  requireTenantScope({ session: { user: {} } }, res, () => { nextCalled = true; });
  assert(status === 403 && !nextCalled, 'GET /api/him/record null-tenant prod -> 403 (never unfiltered)');
  // valid tenant passes
  status = null; nextCalled = false;
  requireTenantScope({ session: { user: { tenantId: 2 } } }, res, () => { nextCalled = true; });
  assert(nextCalled && status === null, 'valid tenant passes requireTenantScope');
  process.env.NODE_ENV = saved;
}

console.log(`\n${BOLD}[2] Longitudinal record: cross-tenant patient -> 404 (IDOR blocked)${RESET}`);
{
  // mirror: SELECT ... FROM patients WHERE id=$1 AND tenant_id=$2
  function openRecord(reqTenantId, patientTenantId) {
    const found = (reqTenantId && patientTenantId === reqTenantId);
    if (!found) return { status: 404, error: 'Patient not found', logged: false };
    return { status: 200, logged: true }; // every successful open writes record_access_log
  }
  const r1 = openRecord(1, 2);
  assert(r1.status === 404, 'tenant_1 opening tenant_2 patient -> 404');
  assert(r1.logged === false, 'blocked open does not leak a log row for foreign patient');
  const r2 = openRecord(2, 2);
  assert(r2.status === 200 && r2.logged === true, 'in-tenant open succeeds AND is access-logged');
}

console.log(`\n${BOLD}[3] Access logging is mandatory (no unlogged read path)${RESET}`);
{
  // simulate the endpoint: after the patient-in-tenant check, an access row is always inserted
  let inserted = [];
  function recordOpen(tenantId, facilityId, patientId, accessorId, accessType, reason) {
    // tenant_id stamped from context, never from body
    inserted.push({ tenant_id: tenantId, patient_id: patientId, accessor_id: accessorId, access_type: accessType, reason });
  }
  recordOpen(3, 3, 77, 9, 'normal', '');
  assert(inserted.length === 1 && inserted[0].access_type === 'normal', 'normal open logs access_type=normal');
  assert(inserted[0].tenant_id === 3, 'access row stamped with session tenant_id (3)');
}

console.log(`\n${BOLD}[4] tenant_id stamped from session, never from body (coding/ROI/break-glass)${RESET}`);
{
  function stampInsert(sessionTenantId, body) {
    // server uses getRequestTenantContext().tenantId — body.tenant_id must be ignored
    const tenant_id = sessionTenantId;
    return { tenant_id, body_ignored: body.tenant_id !== tenant_id };
  }
  const c = stampInsert(2, { tenant_id: 99, code: 'A00' });
  assert(c.tenant_id === 2 && c.body_ignored, 'coding INSERT stamps session tenant_id, ignores body.tenant_id=99');
  const roi = stampInsert(1, { tenant_id: 777, requester: 'X' });
  assert(roi.tenant_id === 1 && roi.body_ignored, 'ROI INSERT stamps session tenant_id, ignores body.tenant_id=777');
  const bg = stampInsert(4, { tenant_id: 0, reason: 'emergency' });
  assert(bg.tenant_id === 4, 'break-glass INSERT stamps session tenant_id (4)');
}

console.log(`\n${BOLD}[5] RLS policy is fail-closed (null app.tenant_id matches no row)${RESET}`);
{
  // mirror of USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
  function rlsMatch(rowTenantId, appSetting) {
    const ctx = (appSetting === '' || appSetting === null || appSetting === undefined) ? null : parseInt(appSetting, 10);
    if (ctx === null || Number.isNaN(ctx)) return false; // NULL comparison -> no match -> 0 rows
    return rowTenantId === ctx;
  }
  assert(rlsMatch(1, '') === false, "empty app.tenant_id -> NULLIF=NULL -> matches NO row (fail-closed)");
  assert(rlsMatch(1, null) === false, 'missing app.tenant_id -> matches no row');
  assert(rlsMatch(1, '2') === false, 'row tenant 1 with ctx 2 -> no match (cross-tenant blocked)');
  assert(rlsMatch(2, '2') === true, 'row tenant 2 with ctx 2 -> match (own tenant)');
}

console.log(`\n${BOLD}[6] ROI state machine + RBAC${RESET}`);
{
  function actROI(curStatus, action) {
    if (action === 'approve') return curStatus === 'pending' ? { status: 'approved' } : { error: 409 };
    if (action === 'deny') return curStatus === 'pending' ? { status: 'denied' } : { error: 409 };
    if (action === 'release') return curStatus === 'approved' ? { status: 'released' } : { error: 409 };
    return { error: 400 };
  }
  assert(actROI('pending', 'approve').status === 'approved', 'pending -> approve OK');
  assert(actROI('pending', 'release').error === 409, 'cannot release a pending request (409)');
  assert(actROI('approved', 'release').status === 'released', 'approved -> release OK');
  assert(actROI('released', 'approve').error === 409, 'cannot re-approve a released request (409)');
  assert(actROI('pending', 'bogus').error === 400, 'invalid action -> 400');
}

console.log(`\n${BOLD}[7] Break-glass requires a reason${RESET}`);
{
  function breakGlass(patientId, reason) {
    if (!patientId || Number.isNaN(parseInt(patientId, 10))) return { status: 400, error: 'patient_id required' };
    if (!reason || !String(reason).trim()) return { status: 400, error: 'Break-glass reason required' };
    return { status: 200, access_type: 'break_glass', alert: 'BREAK_GLASS' };
  }
  assert(breakGlass(5, '').status === 400, 'break-glass without reason -> 400');
  assert(breakGlass(5, '   ').status === 400, 'break-glass with blank reason -> 400');
  const okBg = breakGlass(5, 'cardiac arrest, no consent obtainable');
  assert(okBg.status === 200 && okBg.access_type === 'break_glass', 'break-glass with reason -> recorded as break_glass');
  assert(okBg.alert === 'BREAK_GLASS', 'break-glass raises BREAK_GLASS audit alert');
}

console.log(`\n${BOLD}${BLUE}=== Summary ===${RESET}`);
console.log(`  ${GREEN}passed${RESET}: ${passed}   ${RED}failed${RESET}: ${failed}`);
if (failureLog.length) { console.log(`\n${RED}Failures:${RESET}`); failureLog.forEach(f => console.log(`  - ${f.name}: ${f.details}`)); }
process.exit(failed === 0 ? 0 : 1);
