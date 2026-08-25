'use strict';
// TIER4_ORTHO_EXT-101: Spine - back pain red flags + disc herniation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACP_Back_Pain_2017', 'NASS_Herniation_2014'];

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

function red_flags(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.trauma, 'trauma');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.fever, 'fever');
  ensureBool(req.iv_drug_use, 'iv_drug_use');
  ensureBool(req.immunosuppressed, 'immunosuppressed');
  ensureBool(req.cancer_history, 'cancer_history');
  ensureBool(req.cauda_equina, 'cauda_equina');
  ensureBool(req.neurological_deficit, 'neurological_deficit');
  ensureNumber(req.duration_weeks, 'duration_weeks');

  const red_flags_count = [req.trauma, req.weight_loss, req.fever, req.iv_drug_use, req.immunosuppressed,
    req.cancer_history, req.cauda_equina, req.neurological_deficit].filter(Boolean).length;
  return {
    red_flags_count,
    urgent_imaging: req.cauda_equina || req.trauma && req.neurological_deficit || req.fever || req.cancer_history,
    imaging_within_4_weeks: red_flags_count >= 2 || req.duration_weeks >= 12 && req.age >= 50,
    conservative_management: red_flags_count === 0 && req.duration_weeks < 12,
    citations: CITATIONS,
  };
}

function disc_herniation(req) {
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureBool(req.sciatica, 'sciatica');
  ensureStr(req.dermatome, 'dermatome');
  ensureBool(req.foot_drop, 'foot_drop');
  ensureBool(req.saddle_anesthesia, 'saddle_anesthesia');
  ensureBool(req.bowel_bladder_dysfunction, 'bowel_bladder_dysfunction');
  ensureNumber(req.oswestry, 'oswestry');

  const cauda = req.bowel_bladder_dysfunction || req.saddle_anesthesia;
  const surgical_urgency = cauda || req.foot_drop;
  const conservative = !cauda && req.duration_weeks < 6;
  return {
    disc_herniation: req.sciatica && req.dermatome,
    cauda_equina: cauda,
    foot_drop: req.foot_drop,
    surgical_candidate: req.oswestry >= 40 && req.duration_weeks >= 6 || surgical_urgency,
    conservative_management: conservative,
    discectomy: surgical_urgency ? 'urgent_within_24_48h' : req.oswestry >= 40 ? 'elective' : 'not_indicated',
    citations: CITATIONS,
  };
}

module.exports = { red_flags, disc_herniation, CITATIONS, ValidationError };