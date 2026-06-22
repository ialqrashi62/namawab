// D2 FHIR Local Sandbox — standalone candidate (NOT wired to production).
// Pure JS, no deps, no DB, no network, DUMMY data only. Run: node fhir_sandbox.js
'use strict';

// ---------- dummy fixtures (synthetic; NOT real patients) ----------
const fixtures = {
  patients: [
    { id: 9001, name_en: 'Test One', name_ar: 'تجريبي واحد', gender: 'male', dob: '1990-01-01', national_id: '0000000001', tenant_id: 1 },
    { id: 9002, name_en: 'Test Two', name_ar: 'تجريبي اثنان', gender: 'female', dob: '1985-05-05', national_id: '0000000002', tenant_id: 1 },
  ],
  encounters: [{ id: 7001, patient_id: 9001, status: 'finished', class: 'AMB', start: '2026-06-23T09:00:00Z', end: '2026-06-23T09:30:00Z', facility_id: 1 }],
  observations: [
    { id: 5001, patient_id: 9001, code: '8867-4', display: 'Heart rate', value: 72, unit: '/min', when: '2026-06-23T09:05:00Z' },
    { id: 5002, patient_id: 9002, code: '8310-5', display: 'Body temperature', value: 37.0, unit: 'Cel', when: '2026-06-23T10:05:00Z' },
  ],
  reports: [{ id: 6001, patient_id: 9001, order_type: 'XRAY', status: 'final', when: '2026-06-23T09:20:00Z', phi_file_id: 1234 }],
  medreqs: [{ id: 4001, patient_id: 9002, medication: 'Paracetamol 500mg', requester: 'Dr Test', dosage: '1 tab q8h', status: 'active' }],
  claims: [{ id: 3001, patient_id: 9001, insurer: 'Test Insurer', total: 150.0, currency: 'SAR', item_desc: 'Consultation' }],
};

// ---------- mappers (DB row -> FHIR R4) ----------
const ref = (t, id) => ({ reference: `${t}/${id}` });
const map = {
  Patient: p => ({ resourceType: 'Patient', id: String(p.id),
    identifier: [{ system: 'https://nama.sa/national-id', value: p.national_id }],
    name: [{ use: 'official', text: p.name_en }], gender: p.gender, birthDate: p.dob,
    managingOrganization: ref('Organization', `tenant-${p.tenant_id}`) }),
  Encounter: e => ({ resourceType: 'Encounter', id: String(e.id), status: e.status,
    class: { code: e.class }, subject: ref('Patient', e.patient_id), period: { start: e.start, end: e.end },
    serviceProvider: ref('Organization', `facility-${e.facility_id}`) }),
  Observation: o => ({ resourceType: 'Observation', id: String(o.id), status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: o.code, display: o.display }] },
    subject: ref('Patient', o.patient_id), effectiveDateTime: o.when,
    valueQuantity: { value: o.value, unit: o.unit, system: 'http://unitsofmeasure.org' } }),
  DiagnosticReport: r => ({ resourceType: 'DiagnosticReport', id: String(r.id), status: r.status,
    code: { text: r.order_type }, subject: ref('Patient', r.patient_id), effectiveDateTime: r.when,
    presentedForm: [{ contentType: 'image/png', url: `/api/phi-files/${r.phi_file_id}`, title: 'guarded' }] }),
  MedicationRequest: m => ({ resourceType: 'MedicationRequest', id: String(m.id), status: m.status, intent: 'order',
    medicationCodeableConcept: { text: m.medication }, subject: ref('Patient', m.patient_id),
    requester: { display: m.requester }, dosageInstruction: [{ text: m.dosage }] }),
  Claim: c => ({ resourceType: 'Claim', id: String(c.id), status: 'active', use: 'claim',
    patient: ref('Patient', c.patient_id), insurer: { display: c.insurer },
    total: { value: c.total, currency: c.currency }, item: [{ sequence: 1, productOrService: { text: c.item_desc } }] }),
};

function buildBundle() {
  const entries = [];
  fixtures.patients.forEach(p => entries.push(map.Patient(p)));
  fixtures.encounters.forEach(e => entries.push(map.Encounter(e)));
  fixtures.observations.forEach(o => entries.push(map.Observation(o)));
  fixtures.reports.forEach(r => entries.push(map.DiagnosticReport(r)));
  fixtures.medreqs.forEach(m => entries.push(map.MedicationRequest(m)));
  fixtures.claims.forEach(c => entries.push(map.Claim(c)));
  return { resourceType: 'Bundle', type: 'collection', entry: entries.map(r => ({ resource: r })) };
}

// ---------- local validator (structural + reference integrity within bundle) ----------
const requiredFields = {
  Patient: ['resourceType', 'id', 'name', 'gender'], Encounter: ['resourceType', 'id', 'status', 'subject'],
  Observation: ['resourceType', 'id', 'status', 'code', 'subject'], DiagnosticReport: ['resourceType', 'id', 'status', 'code', 'subject'],
  MedicationRequest: ['resourceType', 'id', 'status', 'intent', 'subject'], Claim: ['resourceType', 'id', 'status', 'patient'],
};
function validate(bundle) {
  const ids = new Set(bundle.entry.map(e => `${e.resource.resourceType}/${e.resource.id}`));
  const results = [];
  for (const { resource: r } of bundle.entry) {
    const req = requiredFields[r.resourceType] || ['resourceType', 'id'];
    const missing = req.filter(k => r[k] === undefined || r[k] === null);
    // reference integrity: every Patient ref must resolve within the bundle
    const subjRef = (r.subject || r.patient || {}).reference;
    const refOk = !subjRef || ids.has(subjRef);
    // PHI guard: no embedded image bytes
    const phiOk = !r.presentedForm || r.presentedForm.every(f => !f.data && /^\/api\/phi-files\//.test(f.url || ''));
    const ok = r.resourceType && missing.length === 0 && refOk && phiOk;
    results.push({ res: `${r.resourceType}/${r.id}`, ok, missing, refOk, phiOk });
  }
  return results;
}

const bundle = buildBundle();
const results = validate(bundle);
let pass = 0, fail = 0;
for (const r of results) { if (r.ok) { pass++; console.log(`PASS ${r.res}`); } else { fail++; console.log(`FAIL ${r.res} missing=[${r.missing}] refOk=${r.refOk} phiOk=${r.phiOk}`); } }
console.log(`\nBundle entries: ${bundle.entry.length} | ${pass}/${pass + fail} PASS (dummy only; no PHI/DB/network)`);
process.exit(fail ? 1 : 0);
