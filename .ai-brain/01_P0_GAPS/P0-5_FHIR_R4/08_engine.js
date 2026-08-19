/**
 * FHIR R4 — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { FHIR_R4: 'HL7 FHIR R4 4.0.1', NPHIES: 'NPHIES FHIR Implementation Guide' };

function makeBundle(resources, type = 'searchset') {
  return {
    resourceType: 'Bundle',
    id: `BUNDLE-${Date.now()}`,
    meta: { lastUpdated: new Date().toISOString(), fhirVersion: '4.0.1' },
    type,
    total: resources.length,
    entry: resources.map(r => ({ fullUrl: `${r.resourceType}/${r.id}`, resource: r })),
  };
}

function patientResource(input) {
  return {
    resourceType: 'Patient',
    id: String(input.patient_id),
    meta: { versionId: '1', lastUpdated: new Date().toISOString(), profile: ['http://nphies.sa/fhir/StructureDefinition/ksa-patient'] },
    identifier: [
      { use: 'official', system: 'http://nphies.sa/sid/nid', value: input.national_id || `NID-${input.patient_id}` },
      { use: 'usual', system: 'http://nphies.sa/sid/mrn', value: `MRN-${input.patient_id}` },
    ],
    active: true,
    name: [{ use: 'official', family: input.family_name || '', given: input.given_name || [`Patient-${input.patient_id}`] }],
    gender: input.gender || 'unknown',
    birthDate: input.dob,
    telecom: input.mobile ? [{ system: 'phone', value: input.mobile, use: 'mobile' }] : [],
  };
}

function observationResource(input) {
  return {
    resourceType: 'Observation',
    id: String(input.id || Date.now()),
    status: input.status || 'final',
    code: { coding: [{ system: 'http://loinc.org', code: input.loinc_code, display: input.test_name }] },
    subject: { reference: `Patient/${input.patient_id}` },
    effectiveDateTime: input.effective || new Date().toISOString(),
    valueQuantity: input.value ? { value: input.value, unit: input.unit, system: 'http://unitsofmeasure.org', code: input.unit_code } : undefined,
    interpretation: input.abnormal ? [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'A', display: 'Abnormal' }] }] : [],
  };
}

function encounterResource(input) {
  return {
    resourceType: 'Encounter',
    id: String(input.id || Date.now()),
    status: input.status || 'in-progress',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: input.class_code || 'AMB' },
    subject: { reference: `Patient/${input.patient_id}` },
    participant: input.provider_id ? [{ individual: { reference: `Practitioner/${input.provider_id}` } }] : [],
    period: { start: input.start || new Date().toISOString(), end: input.end },
    reasonCode: input.reason ? [{ coding: [{ system: 'http://snomed.info/sct', code: input.reason, display: input.reason_display }] }] : [],
  };
}

function medicationRequestResource(input) {
  return {
    resourceType: 'MedicationRequest',
    id: String(input.id || Date.now()),
    status: input.status || 'active',
    intent: input.intent || 'order',
    medicationCodeableConcept: { text: input.drug_name, coding: input.sfda_code ? [{ system: 'http://sfda.gov.sa/drug-code', code: input.sfda_code }] : [] },
    subject: { reference: `Patient/${input.patient_id}` },
    authoredOn: input.authored || new Date().toISOString(),
    requester: input.provider_id ? { reference: `Practitioner/${input.provider_id}` } : undefined,
    dosageInstruction: [{ text: `${input.dose || ''} ${input.route || 'PO'} ${input.frequency || ''}`.trim() }],
  };
}

function bundleToCSV(bundle) {
  if (!bundle.entry || bundle.entry.length === 0) return '';
  const resources = bundle.entry.map(e => e.resource);
  const headers = Object.keys(resources[0]);
  const rows = resources.map(r => headers.map(h => JSON.stringify(r[h] || '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function csvToBundle(csv, resourceType) {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return makeBundle([]);
  const headers = lines[0].split(',');
  const resources = lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    const resource = { resourceType, id: String(idx + 1) };
    headers.forEach((h, i) => {
      try { resource[h] = JSON.parse(values[i]); } catch { resource[h] = values[i]; }
    });
    return resource;
  });
  return makeBundle(resources);
}

function fhirValidation(resource) {
  const errors = [];
  if (!resource.resourceType) errors.push('missing resourceType');
  if (resource.resourceType === 'Patient' && !resource.identifier) errors.push('Patient.identifier required');
  if (resource.resourceType === 'Observation' && !resource.code) errors.push('Observation.code required');
  if (resource.resourceType === 'MedicationRequest' && !resource.medicationCodeableConcept) errors.push('MedicationRequest.medication required');
  return { valid: errors.length === 0, errors };
}

module.exports = {
  patientResource, observationResource, encounterResource, medicationRequestResource,
  makeBundle, bundleToCSV, csvToBundle, fhirValidation,
  CITATIONS, ValidationError,
};
