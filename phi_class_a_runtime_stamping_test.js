// PHI Class A runtime tenant-stamping compatibility — static audit of server.js.
// Asserts the newly tenant-owned table INSERT routes stamp tenant_id from trusted
// session context (never body) and are fail-closed (requireTenantScope), so they
// remain compatible after the app switches to the non-superuser nama_medical_app role
// (FORCE-RLS WITH CHECK). Mirrors cross_tenant_idor_sweep_test / rls_insert_tenant_stamping_test.
const fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname, 'server.js'), 'utf8');
let pass = 0, fail = 0;
function ok(name, cond, detail) { if (cond) { pass++; console.log('PASS — ' + name); } else { fail++; console.log('FAIL — ' + name + (detail ? ' | ' + detail : '')); } }

// Extract the handler body following a route declaration.
function block(decl, len = 1300) {
  const i = src.indexOf(decl);
  if (i < 0) return null;
  return src.slice(i, i + len);
}

// --- 1) blood_bank_units POST ---
const units = block("app.post('/api/blood-bank/units'");
ok('blood_bank_units POST exists', !!units);
ok('blood_bank_units POST is fail-closed (requireTenantScope)', units && /requireAuth,\s*requireTenantScope/.test(units));
ok('blood_bank_units POST derives tenant from trusted session', units && units.includes('getRequestTenantContext(req)'));
ok('blood_bank_units INSERT stamps tenant_id + facility_id', units && /INSERT INTO blood_bank_units[^;]*tenant_id,\s*facility_id/.test(units));
ok('blood_bank_units INSERT passes [tenantId, facilityId] (not body)', units && /notes\s*\|\|\s*'',\s*tenantId,\s*facilityId/.test(units));
ok('blood_bank_units does NOT destructure tenant_id from body', units && !/const\s*\{[^}]*tenant_id[^}]*\}\s*=\s*req\.body/.test(units));
ok('blood_bank_units post-insert SELECT is tenant-scoped', units && /SELECT \* FROM blood_bank_units WHERE id=\$1 AND tenant_id=\$2/.test(units));

// --- 2) blood_bank_donors POST ---
const donors = block("app.post('/api/blood-bank/donors'");
ok('blood_bank_donors POST exists', !!donors);
ok('blood_bank_donors POST is fail-closed (requireTenantScope)', donors && /requireAuth,\s*requireTenantScope/.test(donors));
ok('blood_bank_donors POST derives tenant from trusted session', donors && donors.includes('getRequestTenantContext(req)'));
ok('blood_bank_donors INSERT stamps tenant_id + facility_id', donors && /INSERT INTO blood_bank_donors[^;]*tenant_id,\s*facility_id/.test(donors));
ok('blood_bank_donors INSERT passes [tenantId, facilityId] (not body)', donors && /notes\s*\|\|\s*'',\s*tenantId,\s*facilityId/.test(donors));
ok('blood_bank_donors does NOT destructure tenant_id from body', donors && !/const\s*\{[^}]*tenant_id[^}]*\}\s*=\s*req\.body/.test(donors));
ok('blood_bank_donors post-insert SELECT is tenant-scoped', donors && /SELECT \* FROM blood_bank_donors WHERE id=\$1 AND tenant_id=\$2/.test(donors));

// --- 3) packages: no active runtime route (ROUTES_ABSENT) ---
ok('packages has NO INSERT route in server.js', !/INSERT INTO packages\b/.test(src));
ok('packages has NO /api/packages route in server.js', !src.includes("'/api/packages'"));

// --- 4) audit_trail: system audit log (DECISION) — logAudit still records; tenant policy is a role-switch precondition ---
ok('logAudit helper still present (audit recording intact)', src.includes('async function logAudit('));
ok('audit_trail INSERT still present in logAudit', /INSERT INTO audit_trail \(/.test(src));
// Documented decision: logAudit is a cross-cutting fire-and-forget helper (~70 call sites) with a
// swallowed catch; strict per-tenant WITH CHECK would silently drop audit rows post-switch and hide
// cross-tenant admin reads. Treated as a system audit log -> policy revision is a role-switch
// precondition (DDL, out of scope here), NOT a 70-call-site runtime stamp. So we do NOT require a
// tenant_id stamp in logAudit; we only assert audit recording is intact (above).

console.log('\nPHI_CLASS_A_RUNTIME_STAMPING: ' + pass + ' PASS | ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
