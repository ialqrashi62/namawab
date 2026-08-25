'use strict';
// TIER5_INTEG_EXT-102: FHIR R4 - resource mapping and bundle
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['FHIR_R4_2018', 'HL7_FHIR_R5_Draft'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function patient_map(req) {
  ensureStr(req.mrn, 'mrn');
  ensureStr(req.given, 'given');
  ensureStr(req.family, 'family');
  ensureStr(req.gender, 'gender'); // male | female | other | unknown
  ensureNumber(req.birth_year, 'birth_year');
  ensureStr(req.nationality, 'nationality');

  return {
    resourceType: 'Patient',
    identifier: [{ system: 'urn:oid:2.16.840.1.113883.4.1', value: req.mrn, use: 'official' }],
    name: [{ use: 'official', family: req.family, given: [req.given] }],
    gender: req.gender,
    birthDate: `${req.birth_year}-01-01`,
    extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality', valueCode: req.nationality }],
    meta: { source: 'urn:nama-medical-erp', profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
    citations: CITATIONS,
  };
}

function observation_map(req) {
  ensureStr(req.code, 'code'); // LOINC code
  ensureStr(req.display, 'display');
  ensureNumber(req.value, 'value');
  ensureStr(req.unit, 'unit');
  ensureStr(req.patient_ref, 'patient_ref');
  ensureStr(req.effective_date, 'effective_date');

  return {
    resourceType: 'Observation',
    status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: req.code, display: req.display }] },
    subject: { reference: req.patient_ref },
    effectiveDateTime: req.effective_date,
    valueQuantity: { value: req.value, unit: req.unit, system: 'http://unitsofmeasure.org', code: req.unit },
    meta: { source: 'urn:nama-medical-erp' },
    citations: CITATIONS,
  };
}

function bundle_construct(req) {
  ensureStr(req.type, 'type'); // collection | searchset | transaction
  ensureBool(req.total_present, 'total_present');
  ensureNumber(req.entry_count, 'entry_count');
  ensureStr(req.request_method, 'request_method');

  const entries = [];
  for (let i = 0; i < Math.min(5, req.entry_count); i++) {
    entries.push({ resource: { resourceType: 'Patient', id: `placeholder-${i}` }, fullUrl: `urn:uuid:placeholder-${i}` });
  }
  return {
    resourceType: 'Bundle',
    id: `bundle-${Date.now()}`,
    type: req.type,
    total: req.total_present ? req.entry_count : undefined,
    entry: entries,
    request: req.type === 'transaction' ? { method: req.request_method, url: 'Patient' } : undefined,
    citations: CITATIONS,
  };
}

module.exports = { patient_map, observation_map, bundle_construct, CITATIONS, ValidationError };