/**
 * access_control_audit_hardening_test.js
 * اختبار ثابت: التحقق من وجود أحداث التدقيق المضافة لمصادقة وحماية المستخدمين والوصول.
 * Static assertion test — no DB/HTTP, no PHI.
 */
const fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname, 'server.js'), 'utf8');
const clinicalSrc = fs.readFileSync(require('path').join(__dirname, 'clinical_cpoe.js'), 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m); } };

// (1) Check audit log on successful user creation in server.js
const startCreate = src.indexOf("app.post('/api/settings/users'");
if (startCreate > -1) {
    const rest = src.slice(startCreate);
    const body = rest.slice(0, rest.indexOf("app.put('/api/settings/users/:id'"));
    ok(/CREATE_USER/.test(body), "successful user create is audited with 'CREATE_USER'");
} else {
    ok(false, "POST /api/settings/users not found");
}

// (2) Check audit log on user deletion in server.js
const startDelete = src.indexOf("app.delete('/api/settings/users/:id'");
if (startDelete > -1) {
    const rest = src.slice(startDelete);
    const body = rest.slice(0, rest.indexOf("mountOnboardingRoutes"));
    ok(/DELETE_USER/.test(body), "user deletion is audited with 'DELETE_USER'");
} else {
    ok(false, "DELETE /api/settings/users/:id not found");
}

// (3) Check audit log on reading audit trail logs in server.js
const startAuditRead = src.indexOf("app.get('/api/audit-trail'");
if (startAuditRead > -1) {
    const rest = src.slice(startAuditRead);
    const body = rest.slice(0, rest.indexOf("app.get('/api/print/invoice/"));
    ok(/READ_AUDIT_LOGS/.test(body), "reading audit logs is audited with 'READ_AUDIT_LOGS'");
} else {
    ok(false, "GET /api/audit-trail not found");
}

// (4) Check audit log on authorization block in requireRole middleware in server.js
const startRequireRole = src.indexOf("function requireRole(");
if (startRequireRole > -1) {
    const rest = src.slice(startRequireRole);
    const body = rest.slice(0, rest.indexOf("function isHrOrAdmin"));
    ok(/BLOCKED_AUTHORIZATION/.test(body), "requireRole authorization failure is audited with 'BLOCKED_AUTHORIZATION'");
} else {
    ok(false, "requireRole function not found");
}

// (5) Check audit log on blocked edit of locked SOAP note in clinical_cpoe.js
const startSoapPatch = clinicalSrc.indexOf("app.patch('/api/clinical-notes/:id'");
if (startSoapPatch > -1) {
    const rest = clinicalSrc.slice(startSoapPatch);
    const body = rest.slice(0, rest.indexOf("app.post('/api/clinical-notes/:id/amend'"));
    ok(/BLOCKED_SOAP_EDIT/.test(body), "blocked SOAP edit attempt is audited with 'BLOCKED_SOAP_EDIT'");
} else {
    ok(false, "PATCH /api/clinical-notes/:id not found in clinical_cpoe.js");
}

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'}: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
