/**
 * P0-5 FHIR R4 Engine
 * Deployed: 2026-08-15
 */
'use strict';

const CITATIONS = { FHIR_R4: 'HL7 FHIR R4 4.0.1', NPHIES: 'NPHIES FHIR IG' };

function makeBundle(resources, type = 'searchset') {
  return { resourceType: 'Bundle', id: `BUNDLE-${Date.now()}`, meta: { lastUpdated: new Date().toISOString(), fhirVersion: '4.0.1' }, type, total: resources.length, entry: resources.map(r => ({ fullUrl: `${r.resourceType}/${r.id}`, resource: r })) };
}

function patientResource(input) {
  return { resourceType: 'Patient', id: String(input.patient_id), meta: { versionId: '1', lastUpdated: new Date().toISOString() }, identifier: [{ use: 'official', system: 'http://nphies.sa/sid/nid', value: input.national_id || `NID-${input.patient_id}` }], active: true, name: [{ use: 'official', family: input.family_name || '', given: input.given_name || [`Patient-${input.patient_id}`] }], gender: input.gender || 'unknown', birthDate: input.dob };
}

function observationResource(input) {
  return { resourceType: 'Observation', id: String(input.id || Date.now()), status: input.status || 'final', code: { coding: [{ system: 'http://loinc.org', code: input.loinc_code, display: input.test_name }] }, subject: { reference: `Patient/${input.patient_id}` }, effectiveDateTime: input.effective || new Date().toISOString(), valueQuantity: input.value ? { value: input.value, unit: input.unit } : undefined };
}

function encounterResource(input) {
  return { resourceType: 'Encounter', id: String(input.id || Date.now()), status: input.status || 'in-progress', class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: input.class_code || 'AMB' }, subject: { reference: `Patient/${input.patient_id}` }, period: { start: input.start || new Date().toISOString() } };
}

function medicationRequestResource(input) {
  return { resourceType: 'MedicationRequest', id: String(input.id || Date.now()), status: input.status || 'active', intent: input.intent || 'order', medicationCodeableConcept: { text: input.drug_name }, subject: { reference: `Patient/${input.patient_id}` }, authoredOn: input.authored || new Date().toISOString() };
}

function fhirValidation(resource) {
  const errors = [];
  if (!resource.resourceType) errors.push('missing resourceType');
  if (resource.resourceType === 'Patient' && !resource.identifier) errors.push('Patient.identifier required');
  if (resource.resourceType === 'Observation' && !resource.code) errors.push('Observation.code required');
  if (resource.resourceType === 'MedicationRequest' && !resource.medicationCodeableConcept) errors.push('MedicationRequest.medication required');
  return { valid: errors.length === 0, errors };
}

module.exports = { patientResource, observationResource, encounterResource, medicationRequestResource, makeBundle, fhirValidation, CITATIONS };