// filepath: tier27_emergency_ext_170_trauma_engine.js
// TIER27_EMERGENCY-170: Trauma (ISS, mechanism, activation)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function trauma_activation(req) {
  ensureStr(req.activation_id, 'activation_id');
  ensureEnum(req.criteria, 'criteria', ['highest_level_full_team','full_trauma_team','trauma_alert','trauma_consult','other']);
  ensureEnum(req.mechanism, 'mechanism', ['mvc_high_speed','mvc_low_speed','mvc_ejection','mvc_rollover','mvc_pedestrian','fall_height','fall_standing','fall_unknown','gunshot_wound','stabbing','blast','crush','assault_blunt','industrial','sport','burn','other']);
  ensureBool(req.penetrating, 'penetrating');
  ensureNumber(req.iss, 'iss');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.intubated, 'intubated');
  let status;
  if (req.mechanism === 'gunshot_wound' || req.mechanism === 'stabbing') status = 'penetrating_trauma_full_team';
  else if (req.iss >= 16) status = 'major_trauma_full_team';
  else if (req.sbp < 90) status = 'hemorrhagic_shock_trauma_team';
  else status = 'trauma_activation_reviewed';
  return { status, level: req.criteria };
}

function iss_score(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureNumber(req.head_ais, 'head');
  ensureNumber(req.face_ais, 'face');
  ensureNumber(req.chest_ais, 'chest');
  ensureNumber(req.abdomen_ais, 'abdomen');
  ensureNumber(req.extremity_ais, 'extremity');
  ensureNumber(req.external_ais, 'external');
  const max1 = Math.max(req.head_ais, req.face_ais, req.chest_ais, req.abdomen_ais, req.extremity_ais, req.external_ais);
  let arr = [req.head_ais, req.face_ais, req.chest_ais, req.abdomen_ais, req.extremity_ais, req.external_ais].sort((a, b) => b - a);
  arr = arr.filter(x => x !== max1);
  const max2 = arr[0] || 0;
  const max3 = arr[1] || 0;
  const iss = max1 * max1 + max2 * max2 + max3 * max3;
  let status;
  if (iss >= 16) status = 'major_trauma_iss_over_16';
  else if (iss >= 9) status = 'moderate_trauma';
  else status = 'minor_trauma';
  return { status, iss };
}

function mechanism(req) {
  ensureStr(req.mechanism_id, 'mechanism_id');
  ensureEnum(req.type, 'type', ['mvc_high_speed','mvc_low_speed','mvc_ejection','mvc_rollover','mvc_pedestrian','fall_height','fall_standing','fall_unknown','gunshot_wound','stabbing','blast','crush','assault_blunt','industrial','sport','burn','other']);
  ensureBool(req.restraint_used, 'restraint');
  ensureBool(req.helmet_used, 'helmet');
  ensureNumber(req.energy_estimate, 'energy');
  ensureBool(req.c_spine_clear, 'cspine_clear');
  let status;
  if (req.type === 'mvc_ejection' || req.type === 'mvc_rollover') status = 'high_risk_mechanism_full_team';
  else if (req.type === 'fall_height' && req.energy > 6) status = 'high_fall_imaging_required';
  else if (!req.cspine_clear && req.type !== 'fall_standing') status = 'cspine_precautions';
  else status = 'mechanism_reviewed';
  return { status, type: req.type };
}

function secondary_survey(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureBool(req.head_exam, 'head');
  ensureBool(req.neck_exam, 'neck');
  ensureBool(req.chest_exam, 'chest');
  ensureBool(req.abdomen_exam, 'abdomen');
  ensureBool(req.pelvis_exam, 'pelvis');
  ensureBool(req.extremities_exam, 'extremities');
  ensureBool(req.back_exam, 'back');
  ensureBool(req.neuro_exam, 'neuro');
  let status;
  const count = (req.head_exam ? 1 : 0) + (req.neck_exam ? 1 : 0) + (req.chest_exam ? 1 : 0) + (req.abdomen_exam ? 1 : 0) + (req.pelvis_exam ? 1 : 0) + (req.extremities_exam ? 1 : 0) + (req.back_exam ? 1 : 0) + (req.neuro_exam ? 1 : 0);
  if (count < 8) status = 'secondary_survey_incomplete';
  else status = 'secondary_survey_complete';
  return { status, count };
}

function transfer_trauma(req) {
  ensureStr(req.transfer_id, 'transfer_id');
  ensureBool(req.verified_level, 'verified');
  ensureNumber(req.transfer_distance_km, 'distance');
  ensureBool(req.ems_present, 'ems');
  ensureBool(req.handoff_documented, 'handoff');
  ensureBool(req.records_sent, 'records');
  let status;
  if (!req.verified_level) status = 'transfer_unverified_review_care';
  else if (!req.handoff_documented) status = 'handoff_required_sbar';
  else if (req.transfer_distance_km > 100 && !req.ems_present) status = 'long_transfer_ems_required';
  else status = 'transfer_appropriate';
  return { status, verified: req.verified_level };
}

const CITATIONS = { ATLS_2024: 'ATLS 10e 2024', ACS_TRAUMA_2024: 'ACS Trauma 2024' };

function funcs() { return { trauma_activation, iss_score, mechanism, secondary_survey, transfer_trauma }; }
module.exports = { funcs, CITATIONS, ValidationError };