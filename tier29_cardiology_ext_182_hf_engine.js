// filepath: tier29_cardiology_ext_182_hf_engine.js
// TIER29_CARDIOLOGY-182: Heart failure, GDMT, transplant bridge
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hf_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.nyha, 'nyha', ['class_i','class_ii','class_iii','class_iv','unknown','other']);
  ensureEnum(req.acc_stage, 'acc_stage', ['stage_a_at_risk','stage_b_pre_hf','stage_c_symptomatic','stage_d_advanced','unknown','other']);
  ensureNumber(req.lvef, 'lvef');
  ensureEnum(req.phenotype, 'phenotype', ['hfref','hfmr','hfpef','unknown','other']);
  ensureNumber(req.ntprobnp, 'ntp');
  ensureBool(req.hospitalized, 'hosp');
  let status;
  if (req.nyha === 'class_iv' || req.acc_stage === 'stage_d_advanced') status = 'advanced_hf_refer_advanced_center';
  else if (req.lvef < 30) status = 'hfref_severe_review_device_advanced_therapies';
  else if (req.phenotype === 'hfpef' && req.ntp > 800) status = 'hfpef_high_ntp_review';
  else status = 'hf_classified';
  return { status, nyha: req.nyha };
}

function gdmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.lvef, 'lvef');
  ensureEnum(req.arni, 'arni', ['none','sacubitril_valsartan','valsartan','other']);
  ensureEnum(req.beta_blocker, 'bb', ['carvedilol','metoprolol_succ','bisoprolol','nebivolol','atenolol','propranolol','other']);
  ensureEnum(req.mra, 'mra', ['spironolactone','eplerenone','none','other']);
  ensureEnum(req.sglt2, 'sglt2', ['dapagliflozin','empagliflozin','sotagliflozin','none','other']);
  ensureNumber(req.k, 'k');
  ensureNumber(req.creatinine, 'cr');
  let status;
  if (req.lvef <= 40 && req.arni === 'none') status = 'arni_recommended_lvef_under_40';
  else if (req.lvef <= 40 && req.beta_blocker === 'none') status = 'beta_blocker_recommended';
  else if (req.lvef <= 40 && req.mra === 'none') status = 'mra_recommended_lvef_under_40';
  else if (req.lvef <= 40 && req.sglt2 === 'none') status = 'sglt2_recommended_lvef_under_40';
  else if (req.k > 5.5 && req.mra !== 'none') status = 'hyperkalemia_mra_review';
  else status = 'gdmt_optimized';
  return { status, gdmt: 'reviewed' };
}

function lvad(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.phase, 'phase', ['bridge_to_transplant','bridge_to_decision','destination_therapy','recovery','not_candidate','other']);
  ensureEnum(req.device, 'device', ['hm3','hm2','hvad','other']);
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.complications, 'comp');
  ensureEnum(req.complication_type, 'comp_type', ['none','pump_thrombosis','driveline_infection','gi_bleed','aortic_insufficiency','stroke','right_failure','other']);
  let status;
  if (req.complication_type === 'pump_thrombosis') status = 'pump_thrombosis_urgent_review';
  else if (req.complication_type === 'stroke') status = 'stroke_evaluation_imaging';
  else if (req.complication_type === 'gi_bleed') status = 'gi_bleed_reduce_anticoagulation_review';
  else status = 'lvad_reviewed';
  return { status, dev: req.device };
}

function pulmonary_h(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.dbp, 'dbp');
  ensureNumber(req.map, 'map');
  ensureNumber(req.cvp, 'cvp');
  ensureEnum(req.therapy, 'therapy', ['diuretic','vasodilator','inotrope','vasopressor','none','combination','other']);
  ensureNumber(req.diuretic_dose, 'dd');
  let status;
  if (req.map < 60 && req.therapy === 'vasodilator') status = 'hypotension_stop_vasodilator_reassess';
  else if (req.cvp > 18 && req.therapy !== 'inotrope') status = 'elevated_cvp_inotrope_review';
  else if (req.dd < 80) status = 'low_diuretic_dose_escalate';
  else status = 'pulmonary_h_reviewed';
  return { status, map: req.map };
}

function transplant_bridge(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.bridging_strategy, 'bridging_strategy', ['none','inotrope','vasodilator','mechanical_circulatory_support','lvad','ecmo','biventricular','other']);
  ensureNumber(req.days_listed, 'listed');
  ensureNumber(req.meld, 'meld');
  ensureNumber(req.bnp, 'bnp');
  ensureBool(req.status_1a, 's1a');
  let status;
  if (req.bridging_strategy === 'ecmo' && !req.status_1a) status = 'ecmo_status_1a_required';
  else if (req.bnp > 1500 && req.meld < 15) status = 'high_bnp_low_meld_review';
  else if (req.days_listed > 365 && !req.bridging_strategy === 'none') status = 'long_listing_review_strategy';
  else status = 'transplant_bridge_reviewed';
  return { status, strat: req.bridging_strategy };
}

const CITATIONS = { ACC_AHA_HF_2024: 'ACC/AHA HF 2024', ESC_HF_2024: 'ESC HF 2024', ISHLT_LVAD_2024: 'ISHLT LVAD 2024' };

function funcs() { return { hf_classification, gdmt, lvad, pulmonary_h, transplant_bridge }; }
module.exports = { funcs, CITATIONS, ValidationError };