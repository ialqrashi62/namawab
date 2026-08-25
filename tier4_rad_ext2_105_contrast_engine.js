'use strict';
// TIER4_RAD_EXT2-105: Contrast Safety - extra safety + reactions
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACR_Contrast_2024'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function gfr_safety(req) {
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.metformin, 'metformin');
  ensureNumber(req.age, 'age');

  let iodine_safe, gad_safe;
  if (req.egfr >= 45) iodine_safe = 'full_iodinated_contrast';
  else if (req.egfr >= 30) iodine_safe = 'hydrate_pre_and_post_contrast';
  else iodine_safe = 'avoid_or_dialysis_timing_if_essential';
  if (req.egfr >= 30) gad_safe = 'standard_gadolinium';
  else if (req.egfr >= 15) gad_safe = 'group_2_agents_use_with_caution';
  else gad_safe = 'avoid_gadolinium_risk_of_nsf';
  const metformin_action = req.metformin && req.egfr < 30 ? 'hold_metformin_48h_pre_and_post_contrast' :
    req.metformin ? 'continue_metformin_with_standard_hydration' : 'no_metformin_to_hold';
  return {
    egfr: req.egfr,
    iodine_safe,
    gad_safe,
    metformin_action,
    nsf_risk: req.egfr < 30 ? 'elevated' : 'low',
    citations: CITATIONS,
  };
}

function reaction(req) {
  ensureStr(req.severity, 'severity'); // mild | moderate | severe
  ensureStr(req.symptoms, 'symptoms'); // itching | hives | wheezing | hypotension | arrest
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureBool(req.previous_reaction, 'previous_reaction');

  let treatment;
  if (req.severity === 'severe' || req.systolic_bp < 90) treatment = 'epinephrine_im_0.5mg_iv_fluids_oxygen_consider_airway';
  else if (req.severity === 'moderate' || req.symptoms === 'wheezing') treatment = 'diphenhydramine_50mg_iv_methylprednisolone_125mg_iv_oxygen';
  else treatment = 'diphenhydramine_50mg_oral_or_iv_observe';
  const premedication = req.previous_reaction ? 'prednisone_50mg_pre_med_13h_7h_1h_then_diphenhydramine_50mg_1h' : 'no_premed';
  return {
    severity: req.severity,
    treatment,
    premedication_next_contrast: premedication,
    monitoring: req.severity === 'severe' ? 'admit_observation_unit_4_6h' :
      req.severity === 'moderate' ? 'observe_1_to_2h' : 'observe_30_60_min',
    citations: CITATIONS,
  };
}

function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

module.exports = { gfr_safety, reaction, CITATIONS, ValidationError };