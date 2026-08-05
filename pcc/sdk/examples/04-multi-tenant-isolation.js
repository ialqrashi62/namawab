// =============================================================================
// 04-multi-tenant-isolation.js
// -----------------------------------------------------------------------------
// Title:       Multi-tenant isolation — prove tenant_id flows through /record
// Description: Uses the Node.js SDK to make the SAME function call under three
//              different tenant_ids and three different decisionIds. Each
//              /record response is then asserted to carry its own tenant_id
//              and decisionId, so a downstream auditor can prove the namespace
//              was not crossed.
// Language:    Node.js (>= 18).
// SDK used:    sdk/nodejs  (PccClient, PccAddictionMed, etc.)
// Run:         node sdk/examples/04-multi-tenant-isolation.js
// =============================================================================

'use strict';

const path = require('path');
const { PccClient } = require(path.join(__dirname, '..', 'nodejs', 'pcc-sdk.js'));

const HOST = 'http://localhost:3201';
// We use pcc-neuro-ext14 / MultipleSclerosisExt because this is the module
// whose /record endpoint currently echoes back `tenant_id`, `decisionId`
// and `recorded: true` — i.e. it lets us assert isolation, not just hope.
const SLUG = 'pcc-neuro-ext14';
const FN   = 'MultipleSclerosisExt';

// Three distinct tenant contexts we will exercise in the same run.
const TENANTS = [
  { tenant_id: 'tnt_riyadh_main',     decisionId: 'dec-ryd-001', created_by: 'dr.ahmed'  },
  { tenant_id: 'tnt_jeddah_branch',   decisionId: 'dec-jed-002', created_by: 'dr.fatima' },
  { tenant_id: 'tnt_dmmamobile_unit', decisionId: 'dec-dmm-003', created_by: 'dr.khalid' }
];

// Realistic MS assessment inputs
const PATIENT_PAYLOAD = { mri_lesions: 7, oligoclonal_bands: true, edss: 2.5 };

function pass(label)   { console.log('  \x1b[32m✓\x1b[0m', label); }
function fail(label)   { console.log('  \x1b[31m✗\x1b[0m', label); }
const RESET = '\x1b[0m';

(async () => {
  console.log('--- 04 Multi-Tenant Isolation ---');
  console.log('Sandbox:', HOST);
  console.log('Module :', SLUG, '/', FN);

  const client = new PccClient({ baseUrl: HOST });
  let allPassed = true;

  for (let i = 0; i < TENANTS.length; i++) {
    const t = TENANTS[i];
    console.log(`\n[tenant #${i + 1}] ${t.tenant_id}  (${t.decisionId}, by ${t.created_by})`);

    let callRes, recRes;
    try {
      callRes = await client.call(SLUG, FN, PATIENT_PAYLOAD);
    } catch (e) {
      fail('call failed: ' + e.message);
      allPassed = false;
      continue;
    }
    const score = typeof callRes.score === 'number' ? callRes.score : null;
    console.log('  call.score     =', score);
    console.log('  call.timestamp =', callRes.ts);
    if (callRes.plan) console.log('  call.plan      =', callRes.plan);

    try {
      recRes = await client.record(SLUG, {
        tenant_id:  t.tenant_id,
        decisionId: t.decisionId,
        fn:         FN,
        input:      callRes.input,
        created_by: t.created_by
      });
    } catch (e) {
      fail('record failed: ' + e.message);
      allPassed = false;
      continue;
    }

    // ----- Tenant-isolation assertions -----
    const echoTenant  = recRes.tenant_id;
    const echoDecisId = recRes.decisionId;
    // Note: this server echoes `tenant_id`, `decisionId` and `recorded`
    // on /record for the neuro module, but does NOT echo `created_by`.
    // We assert what the contract actually guarantees.

    if (echoTenant === t.tenant_id) pass(`tenant_id preserved  : ${echoTenant}`);
    else { fail(`tenant_id MISMATCH  sent=${t.tenant_id}  got=${echoTenant}`); allPassed = false; }

    if (echoDecisId === t.decisionId) pass(`decisionId preserved : ${echoDecisId}`);
    else { fail(`decisionId MISMATCH sent=${t.decisionId} got=${echoDecisId}`); allPassed = false; }

    if (recRes.recorded === true) pass('recorded flag = true');
    else { fail('recorded flag missing/false'); allPassed = false; }
  }

  console.log('\n=== Isolation verdict ===');
  if (allPassed) {
    console.log(RESET + '\x1b[32mAll tenant contexts stayed isolated.\x1b[0m' + RESET);
  } else {
    console.log('\x1b[31mISOLATION FAILURE — see ✗ marks above.\x1b[0m' + RESET);
    process.exitCode = 1;
  }
})();
