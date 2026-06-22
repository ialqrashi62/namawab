// Phase B D2 — FHIR R4 mapping PROTOTYPE (candidate, sandbox-only).
// PURPOSE: prove the shape of NamaMedical-row -> FHIR-resource mapping with DUMMY data only.
// SAFETY: pure JS, no dependencies, NO DB access, NO external/network calls, NO real PHI.
//   This file is NOT wired into the production app; it is a local candidate run with `node`.
'use strict';

// ---- DUMMY NamaMedical-shaped rows (synthetic; not real patients) ----
const dummy = {
  patient:   { id: 9001, name_en: 'Test Patient', name_ar: 'مريض تجريبي', gender: 'male', dob: '1990-01-01', national_id: '0000000000', tenant_id: 1 },
  encounter: { id: 7001, patient_id: 9001, status: 'finished', class: 'AMB', start: '2026-06-23T09:00:00Z', end: '2026-06-23T09:30:00Z', facility_id: 1 },
  obs:       { id: 5001, patient_id: 9001, code: '8867-4', display: 'Heart rate', value: 72, unit: '/min', when: '2026-06-23T09:05:00Z' },
  report:    { id: 6001, patient_id: 9001, order_type: 'XRAY', status: 'final', when: '2026-06-23T09:20:00Z', phi_file_id: 1234 },
  medreq:    { id: 4001, patient_id: 9001, medication: 'Paracetamol 500mg', requester: 'Dr Test', dosage: '1 tab q8h', status: 'active' },
  claim:     { id: 3001, patient_id: 9001, insurer: 'Test Insurer', total: 150.0, currency: 'SAR', item_desc: 'Consultation' },
};

// ---- mappers (NamaMedical row -> FHIR R4 resource) ----
const ref = (t, id) => ({ reference: `${t}/${id}` });
const M = {
  Patient: p => ({ resourceType: 'Patient', id: String(p.id),
    identifier: [{ system: 'https://nama.sa/national-id', value: p.national_id }],
    name: [{ use: 'official', text: p.name_en }, { use: 'official', text: p.name_ar }],
    gender: p.gender, birthDate: p.dob,
    managingOrganization: ref('Organization', `tenant-${p.tenant_id}`) }),
  Encounter: e => ({ resourceType: 'Encounter', id: String(e.id), status: e.status,
    class: { code: e.class }, subject: ref('Patient', e.patient_id),
    period: { start: e.start, end: e.end },
    serviceProvider: ref('Organization', `facility-${e.facility_id}`) }),
  Observation: o => ({ resourceType: 'Observation', id: String(o.id), status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: o.code, display: o.display }] },
    subject: ref('Patient', o.patient_id), effectiveDateTime: o.when,
    valueQuantity: { value: o.value, unit: o.unit, system: 'http://unitsofmeasure.org' } }),
  DiagnosticReport: r => ({ resourceType: 'DiagnosticReport', id: String(r.id), status: r.status,
    code: { text: r.order_type }, subject: ref('Patient', r.patient_id), effectiveDateTime: r.when,
    // image served only via the A3A guarded route, never embedded
    presentedForm: [{ contentType: 'image/png', url: `/api/phi-files/${r.phi_file_id}`, title: 'guarded' }] }),
  MedicationRequest: m => ({ resourceType: 'MedicationRequest', id: String(m.id), status: m.status, intent: 'order',
    medicationCodeableConcept: { text: m.medication }, subject: ref('Patient', m.patient_id),
    requester: { display: m.requester }, dosageInstruction: [{ text: m.dosage }] }),
  Claim: c => ({ resourceType: 'Claim', id: String(c.id), status: 'active', use: 'claim',
    patient: ref('Patient', c.patient_id), insurer: { display: c.insurer },
    total: { value: c.total, currency: c.currency },
    item: [{ sequence: 1, productOrService: { text: c.item_desc } }] }),
};

// ---- minimal structural validation (no external validator/network) ----
const required = {
  Patient: ['resourceType', 'id', 'name', 'gender'],
  Encounter: ['resourceType', 'id', 'status', 'subject'],
  Observation: ['resourceType', 'id', 'status', 'code', 'subject'],
  DiagnosticReport: ['resourceType', 'id', 'status', 'code', 'subject'],
  MedicationRequest: ['resourceType', 'id', 'status', 'intent', 'subject'],
  Claim: ['resourceType', 'id', 'status', 'patient'],
};
const rows = { Patient: dummy.patient, Encounter: dummy.encounter, Observation: dummy.obs,
  DiagnosticReport: dummy.report, MedicationRequest: dummy.medreq, Claim: dummy.claim };

let pass = 0, fail = 0;
for (const [type, row] of Object.entries(rows)) {
  const res = M[type](row);
  const missing = required[type].filter(k => res[k] === undefined || res[k] === null);
  const okType = res.resourceType === type;
  const subjOk = !res.subject || /^Patient\/\d+$/.test(res.subject.reference || '');
  if (okType && missing.length === 0 && subjOk) { pass++; console.log(`PASS ${type} (id=${res.id})`); }
  else { fail++; console.log(`FAIL ${type} missing=[${missing}] typeOk=${okType} subjOk=${subjOk}`); }
}
// guard: no embedded PHI bytes; report image is a guarded reference only
const drp = M.DiagnosticReport(dummy.report).presentedForm[0];
const guardOk = /^\/api\/phi-files\//.test(drp.url) && !drp.data;
console.log(guardOk ? 'PASS DiagnosticReport image is guarded reference (no embedded bytes)' : 'FAIL guarded image');
guardOk ? pass++ : fail++;
console.log(`\n${pass}/${pass + fail} PASS (dummy data only; no PHI, no DB, no external calls)`);
process.exit(fail ? 1 : 0);
