/**
 * pcc/schemas.js — Joi-style validation schemas for the PCC.
 * We use a hand-rolled, dependency-free validator to keep PCC
 * zero-external. (In production we'd use Joi or Zod.)
 */
'use strict';

const TYPES = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !Number.isNaN(v),
  integer: (v) => Number.isInteger(v),
  bool: (v) => typeof v === 'boolean',
  uuid: (v) => typeof v === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v),
  array: (v) => Array.isArray(v),
  object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
};

function makeValidator(spec) {
  return function validate(body) {
    if (!body || typeof body !== 'object') {
      return { error: { details: [{ message: 'body must be an object' }] } };
    }
    for (const [field, rule] of Object.entries(spec)) {
      const v = body[field];
      if (rule.required && (v === undefined || v === null)) {
        return { error: { details: [{ message: `${field} is required` }] } };
      }
      if (v === undefined || v === null) continue;
      if (rule.type && !TYPES[rule.type](v)) {
        return { error: { details: [{ message: `${field} must be ${rule.type}` }] } };
      }
      if (rule.enum && !rule.enum.includes(v)) {
        return { error: { details: [{ message: `${field} must be one of ${rule.enum.join(',')}` }] } };
      }
      if (rule.min !== undefined && v.length !== undefined && v.length < rule.min) {
        return { error: { details: [{ message: `${field} must have at least ${rule.min} chars` }] } };
      }
      if (rule.max !== undefined && v.length !== undefined && v.length > rule.max) {
        return { error: { details: [{ message: `${field} must have at most ${rule.max} chars` }] } };
      }
      if (rule.minNum !== undefined && v < rule.minNum) {
        return { error: { details: [{ message: `${field} must be >= ${rule.minNum}` }] } };
      }
      if (rule.maxNum !== undefined && v > rule.maxNum) {
        return { error: { details: [{ message: `${field} must be <= ${rule.maxNum}` }] } };
      }
    }
    return { value: body };
  };
}

const cathLabProcedureCreate = makeValidator({
  patientId: { type: 'integer', required: true, minNum: 1 },
  encounterId: { type: 'integer', required: true, minNum: 1 },
  procedureType: { type: 'string', required: true, enum:
    ['diagnostic', 'pci_simple', 'pci_complex', 'cto_pci', 'bifurcation',
     'left_main', 'vein_graft', 'rotational_atherectomy', 'orbital_atherectomy',
     'ivl', 'ivus', 'oct', 'ffs_ifr'] },
  scheduledAt: { type: 'string' },
  primaryOperatorId: { type: 'integer' },
  cptCodes: { type: 'array' },
});

const cathLabVesselCreate = makeValidator({
  vesselName: { type: 'string', required: true, enum:
    ['LAD', 'LCx', 'RCA', 'LM', 'Diag', 'OM', 'PDA', 'PLB', 'SVG', 'LIMA', 'RIMA'] },
  segment: { type: 'string' },
  interventionType: { type: 'string', required: true, enum:
    ['stent', 'balloon', 'rotablation', 'orbital_atherectomy',
     'ivl', 'thrombus_aspiration', 'ivus', 'oct', 'ffs', 'ifr'] },
  stentSizeMm: { type: 'number' },
  stentLengthMm: { type: 'integer' },
  preStenosisPct: { type: 'integer', required: true, minNum: 0, maxNum: 100 },
  postStenosisPct: { type: 'integer', required: true, minNum: 0, maxNum: 100 },
});

const ccuAdmissionCreate = makeValidator({
  patientId: { type: 'integer', required: true, minNum: 1 },
  encounterId: { type: 'integer', required: true, minNum: 1 },
  admissionType: { type: 'string', required: true, enum:
    ['post_pci', 'post_arrest', 'stemi', 'nstemi', 'cardiogenic_shock',
     'arrhythmia', 'decompensated_hf', 'observation', 'transfer'] },
  primaryDiagnosis: { type: 'string' },
  cptCodes: { type: 'array' },
});

const ccuVitalCreate = makeValidator({
  heartRate: { type: 'integer' },
  sbpMmhg: { type: 'integer' },
  dbpMmhg: { type: 'integer' },
  mapMmhg: { type: 'integer' },
  spo2Pct: { type: 'integer' },
  rhythm: { type: 'string' },
  onVasopressor: { type: 'bool' },
  arrhythmiaFlag: { type: 'string' },
  measuredAt: { type: 'string' },
});

module.exports = {
  RS: {
    cathLabProcedureCreate,
    cathLabVesselCreate,
    ccuAdmissionCreate,
    ccuVitalCreate,
  },
};
