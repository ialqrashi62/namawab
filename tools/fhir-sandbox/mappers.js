// FHIR sandbox — mappers: NamaMedical-shaped row -> FHIR R4 resource.
// Pure functions, no DB, no network. PHI images are referenced via the A3A guarded route only.
'use strict';
const ref = (t, id) => ({ reference: `${t}/${id}` });

const mappers = {
  Patient: p => ({
    resourceType: 'Patient', id: String(p.id),
    identifier: [{ system: 'https://nama.sa/national-id', value: p.national_id }],
    name: [{ use: 'official', text: p.name_en }, { use: 'official', text: p.name_ar }],
    gender: p.gender, birthDate: p.dob,
    managingOrganization: ref('Organization', `tenant-${p.tenant_id}`),
  }),
  Encounter: e => ({
    resourceType: 'Encounter', id: String(e.id), status: e.status,
    class: { code: e.class }, subject: ref('Patient', e.patient_id),
    period: { start: e.start, end: e.end },
    serviceProvider: ref('Organization', `facility-${e.facility_id}`),
  }),
  Observation: o => ({
    resourceType: 'Observation', id: String(o.id), status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: o.code, display: o.display }] },
    subject: ref('Patient', o.patient_id), effectiveDateTime: o.when,
    valueQuantity: { value: o.value, unit: o.unit, system: 'http://unitsofmeasure.org' },
  }),
  DiagnosticReport: r => ({
    resourceType: 'DiagnosticReport', id: String(r.id), status: r.status,
    code: { text: r.order_type }, subject: ref('Patient', r.patient_id), effectiveDateTime: r.when,
    // guarded reference only — never embed PHI bytes
    presentedForm: [{ contentType: 'image/png', url: `/api/phi-files/${r.phi_file_id}`, title: 'guarded' }],
  }),
  MedicationRequest: m => ({
    resourceType: 'MedicationRequest', id: String(m.id), status: m.status, intent: 'order',
    medicationCodeableConcept: { text: m.medication }, subject: ref('Patient', m.patient_id),
    requester: { display: m.requester }, dosageInstruction: [{ text: m.dosage }],
  }),
  Claim: c => ({
    resourceType: 'Claim', id: String(c.id), status: 'active', use: 'claim',
    patient: ref('Patient', c.patient_id), insurer: { display: c.insurer },
    total: { value: c.total, currency: c.currency },
    item: [{ sequence: 1, productOrService: { text: c.item_desc } }],
  }),
};

function buildBundle(fx) {
  const entry = [];
  (fx.patients || []).forEach(p => entry.push({ resource: mappers.Patient(p) }));
  (fx.encounters || []).forEach(e => entry.push({ resource: mappers.Encounter(e) }));
  (fx.observations || []).forEach(o => entry.push({ resource: mappers.Observation(o) }));
  (fx.reports || []).forEach(r => entry.push({ resource: mappers.DiagnosticReport(r) }));
  (fx.medreqs || []).forEach(m => entry.push({ resource: mappers.MedicationRequest(m) }));
  (fx.claims || []).forEach(c => entry.push({ resource: mappers.Claim(c) }));
  return { resourceType: 'Bundle', type: 'collection', entry };
}

module.exports = { mappers, buildBundle, ref };
