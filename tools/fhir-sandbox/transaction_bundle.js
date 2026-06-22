// FHIR sandbox — build a valid FHIR R4 *transaction* Bundle from dummy fixtures.
// Canonical HAPI pattern: urn:uuid fullUrls + POST + intra-bundle reference rewriting.
// HAPI resolves the urn:uuid references atomically and assigns server ids. Dummy only, no PHI.
'use strict';
const { mappers } = require('./mappers');
const fx = require('./fixtures');

// deterministic urn:uuid per resource (no randomness)
function urn(seq) { return `urn:uuid:${String(seq).padStart(8, '0')}-0000-4000-8000-000000000000`; }

function buildTransactionBundle(f = fx) {
  // dependency order: Organizations -> Patients -> Encounter/Observation/Report/MedReq/Claim
  const resources = [];
  resources.push({ resourceType: 'Organization', id: 'tenant-1', name: 'SBX Tenant 1' });
  resources.push({ resourceType: 'Organization', id: 'facility-1', name: 'SBX Facility 1' });
  (f.patients || []).forEach(p => resources.push(mappers.Patient(p)));
  (f.encounters || []).forEach(e => resources.push(mappers.Encounter(e)));
  (f.observations || []).forEach(o => resources.push(mappers.Observation(o)));
  (f.reports || []).forEach(r => resources.push(mappers.DiagnosticReport(r)));
  (f.medreqs || []).forEach(m => resources.push(mappers.MedicationRequest(m)));
  (f.claims || []).forEach(c => resources.push(mappers.Claim(c)));

  // map "ResourceType/id" -> urn:uuid (assigned in order)
  const refMap = {};
  resources.forEach((r, i) => { refMap[`${r.resourceType}/${r.id}`] = urn(i + 1); });

  // recursively rewrite reference strings to their urn:uuid; relative org/facility names map too
  function rewrite(node) {
    if (Array.isArray(node)) return node.forEach(rewrite);
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        if (k === 'reference' && typeof node[k] === 'string' && refMap[node[k]]) node[k] = refMap[node[k]];
        else rewrite(node[k]);
      }
    }
  }
  resources.forEach(rewrite);

  // POST create: drop client id (server assigns); urn:uuid fullUrl carries intra-bundle identity
  const entry = resources.map((r, i) => {
    const fullUrl = urn(i + 1);
    const res = { ...r }; delete res.id;
    return { fullUrl, resource: res, request: { method: 'POST', url: r.resourceType } };
  });
  return { resourceType: 'Bundle', type: 'transaction', entry };
}

module.exports = { buildTransactionBundle };

// allow `node transaction_bundle.js` to print the bundle (for inspection; no network)
if (require.main === module) process.stdout.write(JSON.stringify(buildTransactionBundle(), null, 2));
