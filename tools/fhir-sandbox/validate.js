// FHIR sandbox — local structural + reference-integrity + PHI-guard validator (no external validator/network).
'use strict';
const REQUIRED = {
  Patient: ['resourceType', 'id', 'name', 'gender'],
  Encounter: ['resourceType', 'id', 'status', 'subject'],
  Observation: ['resourceType', 'id', 'status', 'code', 'subject'],
  DiagnosticReport: ['resourceType', 'id', 'status', 'code', 'subject'],
  MedicationRequest: ['resourceType', 'id', 'status', 'intent', 'subject'],
  Claim: ['resourceType', 'id', 'status', 'patient'],
};

function validateResource(r, idIndex) {
  const req = REQUIRED[r.resourceType] || ['resourceType', 'id'];
  const missing = req.filter(k => r[k] === undefined || r[k] === null);
  const subjRef = (r.subject || r.patient || {}).reference;
  const refOk = !subjRef || idIndex.has(subjRef);               // reference integrity within bundle
  const phiOk = !r.presentedForm || r.presentedForm.every(f => !f.data && /^\/api\/phi-files\//.test(f.url || '')); // no embedded PHI
  return { res: `${r.resourceType}/${r.id}`, ok: !!r.resourceType && missing.length === 0 && refOk && phiOk, missing, refOk, phiOk };
}

function validateBundle(bundle) {
  const idIndex = new Set(bundle.entry.map(e => `${e.resource.resourceType}/${e.resource.id}`));
  return bundle.entry.map(e => validateResource(e.resource, idIndex));
}

module.exports = { validateBundle, validateResource, REQUIRED };
