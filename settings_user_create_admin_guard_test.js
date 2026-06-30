/**
 * settings_user_create_admin_guard_test.js
 * اختبار ثابت: التحقق من أن إنشاء مستخدم نظام (POST /api/settings/users) محمي بحارس Admin فقط.
 * Static assertion test — no DB/HTTP, no PHI. node settings_user_create_admin_guard_test.js
 */
const fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname, 'server.js'), 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m); } };

// isolate the POST /api/settings/users handler body (up to the next app.<verb>)
const start = src.indexOf("app.post('/api/settings/users'");
ok(start > -1, "POST /api/settings/users handler exists");
const rest = src.slice(start);
const next = rest.indexOf("app.put('/api/settings/users/:id'");
const body = rest.slice(0, next > -1 ? next : 4000);

// Batch 2: the inline `role !== 'Admin'` check was unified into the requireTenantAdmin middleware
// (runs before the handler; identity from session). Same Admin-only invariant, centralized + tested.
ok(/requireTenantAdmin\(\{[^}]*action:\s*'BLOCKED_USER_CREATE'/.test(body), "guard: requireTenantAdmin (Admin-only) bound to the route");
ok(/BLOCKED_USER_CREATE/.test(body), "audit action on blocked create is preserved");
// the Admin gate is middleware -> it executes (and 403s) BEFORE the INSERT INTO system_users
const guardIdx = body.indexOf('requireTenantAdmin');
const insertIdx = body.indexOf('INSERT INTO system_users');
ok(guardIdx > -1 && insertIdx > -1 && guardIdx < insertIdx, "admin guard precedes INSERT INTO system_users");
// identity must come from session, never req.body (no req.body.role decides authz)
ok(/requireRole\('settings'\)/.test(body), "still layered behind requireRole('settings')");
// the shared guard module is what returns 403 for non-admins (behavioral proof in rbac_guards_test.js)
const guardSrc = fs.readFileSync(require('path').join(__dirname, 'rbac_guards.js'), 'utf8');
ok(/requireTenantAdmin/.test(guardSrc) && /status\(403\)/.test(guardSrc), "rbac_guards.requireTenantAdmin returns 403");

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'}: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
