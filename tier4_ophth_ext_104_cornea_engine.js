'use strict';
// TIER4_OPHTH_EXT-104: Cornea - ulcer + dry eye
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAO_Keratitis_2018', 'TFOS_Dry_Eye_2017'];

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

function ulcer(req) {
  ensureBool(req.pain, 'pain');
  ensureBool(req.redness, 'redness');
  ensureBool(req.contact_lens, 'contact_lens');
  ensureBool(req.infiltrate, 'infiltrate');
  ensureBool(req.hypopyon, 'hypopyon');
  ensureNumber(req.size_mm, 'size_mm');
  ensureStr(req.location, 'location'); // central | paracentral | peripheral

  const severity = req.hypopyon || req.contact_lens && req.infiltrate ? 'severe' :
    req.infiltrate && req.size_mm >= 1 ? 'moderate' :
      req.infiltrate ? 'mild' : 'not_ulcer';
  const treatment = severity === 'severe' ? 'fortified_antibiotics_moxifloxacin_with_cycloplegic_culture_first' :
    severity === 'moderate' ? 'topical_fluoroquinolone_q1h_then_taper' :
      severity === 'mild' ? 'topical_fluoroquinolone_qid' :
        'observe_with_artificial_tears';
  return {
    severity,
    central: req.location === 'central',
    treatment,
    urgent_referral: severity === 'severe' || req.location === 'central',
    monitoring: severity === 'severe' ? 'q24h' : severity === 'moderate' ? 'q1_2_days' : 'q3_5_days',
    citations: CITATIONS,
  };
}

function dry_eye(req) {
  ensureBool(req.symptoms_grittiness, 'symptoms_grittiness');
  ensureBool(req.symptoms_burning, 'symptoms_burning');
  ensureBool(req.schirmer_test, 'schirmer_test'); // positive if < 10 mm in 5 min
  ensureBool(req.tbut_low, 'tbut_low');
  ensureBool(req.systemic_disease, 'systemic_disease');
  ensureBool(req.contact_lens, 'contact_lens');

  const severity = req.schirmer_test && req.tbut_low && req.systemic_disease ? 'severe' :
    req.schirmer_test || req.tbut_low ? 'moderate' :
      'mild';
  const treatment = severity === 'severe' ? 'cyclosporine_or_lifitegrast_with_punctal_plug_and_serum_tears' :
    severity === 'moderate' ? 'artificial_tears_prn_cyclosporine_consider_punctal_plug' :
      'artificial_tears_prn_lifestyle_omega_3';
  return {
    severity,
    treatment,
    lifestyle: ['humidifier', 'reduce_screen_time', 'omega_3_supplementation', 'warm_compress'],
    monitoring: severity === 'severe' ? 'q1_3_months' : 'q6_months',
    citations: CITATIONS,
  };
}

module.exports = { ulcer, dry_eye, CITATIONS, ValidationError };