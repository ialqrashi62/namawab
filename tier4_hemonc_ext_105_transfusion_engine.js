'use strict';
// TIER4_HEMONC_EXT-105: Transfusion compatibility + component
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AABB_Transfusion_2017', 'NHLBI_Transfusion'];

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

function compatibility(req) {
  ensureStr(req.recipient_abo, 'recipient_abo'); // A | B | AB | O
  ensureStr(req.recipient_rh, 'recipient_rh'); // positive | negative
  ensureBool(req.previous_transfusion, 'previous_transfusion');
  ensureBool(req.previous_antibody, 'previous_antibody');

  const compatible_abo = req.recipient_abo === 'O' ? 'O_only' :
    req.recipient_abo === 'A' ? 'A_or_O' :
      req.recipient_abo === 'B' ? 'B_or_O' : 'AB_A_B_O_universal_recipient';
  const compatible_rh = req.recipient_rh === 'negative' && req.previous_antibody ? 'negative_mandatory_consider_kell_negative' : req.recipient_rh;
  const screening_recommended = req.previous_antibody || req.previous_transfusion;
  return {
    recipient_abo: req.recipient_abo,
    recipient_rh: req.recipient_rh,
    compatible_abo,
    compatible_rh,
    type_and_screen_recommended: screening_recommended,
    crossmatch_required: req.previous_antibody,
    citations: CITATIONS,
  };
}

function component(req) {
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.platelet, 'platelet');
  ensureNumber(req.inr, 'inr');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureStr(req.bleeding_type, 'bleeding_type'); // acute | active | none

  const rbc_threshold = req.symptomatic ? 8 : 7;
  const platelet_threshold = req.bleeding_type === 'acute' ? 50 : 10;
  const ffp_threshold = req.inr >= 1.6;
  return {
    rbc_needed: req.hgb < rbc_threshold,
    platelet_needed: req.platelet < platelet_threshold,
    ffp_needed: ffp_threshold,
    cryo_needed: req.bleeding_type === 'acute' && false, // for fibrinogen < 100 - need more info
    rbc_threshold,
    platelet_threshold,
    citations: CITATIONS,
  };
}

module.exports = { compatibility, component, CITATIONS, ValidationError };