// audit_trail tenant-stamping static audit — verifies logAudit stamps tenant_id from the
// trusted ALS context (getCurrentTenantId), never from body, with NULL allowed for system
// events. Pairs with the audit_trail_rls_policy candidate (write-always + read-isolated +
// append-only) so audit writes survive the switch to the non-superuser nama_medical_app role.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log((c ? 'PASS' : 'FAIL') + ' — ' + n + (d ? ' | ' + d : '')); };

// getCurrentTenantId imported from db_postgres
ok('getCurrentTenantId imported from db_postgres', /require\(['"]\.\/db_postgres['"]\)/.test(src) && /\bgetCurrentTenantId\b\s*[},]/.test(src.slice(0, 2000)));

// extract logAudit body
const i = src.indexOf('async function logAudit(');
const body = i >= 0 ? src.slice(i, i + 700) : null;
ok('logAudit helper present', !!body);
ok('logAudit reads tenant from ALS (getCurrentTenantId())', body && body.includes('getCurrentTenantId()'));
ok('logAudit INSERT includes tenant_id column', body && /INSERT INTO audit_trail \([^)]*\btenant_id\b[^)]*\)/.test(body));
ok('logAudit INSERT has 7 placeholders ($1..$7)', body && /VALUES \(\$1,\$2,\$3,\$4,\$5,\$6,\$7\)/.test(body));
ok('logAudit passes tid (the ALS value) as last param', body && /ip \|\| '',\s*tid\s*\]/.test(body));
ok('logAudit does NOT read tenant_id from req.body', body && !/req\.body/.test(body));

// the audit policy candidate exists (companion)
const sqlDir = path.join(__dirname, '..', 'docs', 'sql');
ok('audit_trail policy candidate up.sql exists', fs.existsSync(path.join(sqlDir, 'audit_trail_rls_policy_candidate_up.sql')));

console.log('\nAUDIT_TRAIL_TENANT_STAMPING: ' + pass + ' PASS | ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
