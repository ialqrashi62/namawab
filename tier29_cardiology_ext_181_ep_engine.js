// filepath: tier29_cardiology_ext_181_ep_engine.js
// TIER29_CARDIOLOGY-181: Electrophysiology, ablation, devices
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function afib_management(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.afib_type, 'afib_type', ['first_detected','paroxysmal','persistent','long_standing_persistent','permanent','post_operative','other']);
  ensureNumber(req.cha2ds2vasc, 'chads');
  ensureNumber(req.has_bled, 'bled');
  ensureEnum(req.rate_control, 'rate_control', ['none','beta_blocker','non_dihydropyridine_ccb','digoxin','amiodarone','combination','other']);
  ensureEnum(req.anticoagulation, 'anticoagulation', ['none','warfarin','doac','lovenox','heparin','other']);
  ensureBool(req.rhythm_control_attempt, 'rhythm');
  let status;
  if (req.chads >= 2 && req.anticoagulation === 'none') status = 'chads_2_or_more_anticoagulation_required';
  else if (req.has_bled >= 3) status = 'has_bled_high_bleed_risk_monitor';
  else if (req.afib_type === 'first_detected' && !req.rhythm) status = 'first_detected_rhythm_control_review';
  else status = 'afib_management_appropriate';
  return { status, chads: req.cha2ds2vasc };
}

function ablation(req) {
  ensureStr(req.procedure_id, 'procedure_id');
  ensureEnum(req.type, 'type', ['rf','cryo','pulsed_field','surgical_maze','avnrt','wpw','aflutter','vt','afib','other']);
  ensureNumber(req.duration_min, 'duration');
  ensureBool(req.acute_success, 'success');
  ensureEnum(req.complication, 'complication', ['none','phrenic_nerve','esophageal','tamponade','vascular','stiff_left_atrium','other']);
  ensureBool(req.recurrence_30d, 'recurrence');
  let status;
  if (req.complication === 'tamponade') status = 'tamponade_pericardiocentesis';
  else if (req.complication === 'esophageal') status = 'esophageal_injury_urgent_endoscopy';
  else if (!req.acute_success) status = 'acute_failure_review_repeat';
  else if (req.recurrence_30d) status = 'early_recurrence_blanking_period_continue';
  else status = 'ablation_successful';
  return { status, success: req.acute_success };
}

function pacemaker(req) {
  ensureStr(req.device_id, 'device_id');
  ensureEnum(req.type, 'type', ['single_chamber','dual_chamber','crt_p','crt_d','icd_single','icd_dual','leadless','subcutaneous','other']);
  ensureEnum(req.indication, 'indication', ['sick_sinus','av_block','syncope','hf_crt','primary_prevention','secondary_prevention','other']);
  ensureBool(req.complication, 'comp');
  ensureNumber(req.battery_voltage, 'battery');
  ensureBool(req.lei_threshold_ok, 'lei_ok');
  let status;
  if (req.battery < 2.5) status = 'battery_low_eol_plan_replacement';
  else if (req.complication) status = 'device_complication_review';
  else if (!req.lei_threshold_ok) status = 'lei_out_of_range_reprogram';
  else status = 'pacemaker_appropriate';
  return { status, t: req.type };
}

function icd(req) {
  ensureStr(req.device_id, 'device_id');
  ensureEnum(req.indication, 'indication', ['primary_prevention','secondary_prevention','brady','other']);
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.appropriate_shocks, 'ap_shocks');
  ensureBool(req.inappropriate_shocks, 'inap_shocks');
  ensureEnum(req.lead_status, 'lead_status', ['normal','fracture','dislodgement','insulation','recall','other']);
  let status;
  if (req.inappropriate_shocks) status = 'inappropriate_shocks_review_svt_discrimination';
  else if (req.appropriate_shocks) status = 'ap_shocks_review_vt_storm_or_isc';
  else if (req.lead_status !== 'normal') status = 'lead_abnormal_review';
  else status = 'icd_reviewed';
  return { status, lvef: req.lvef };
}

function anticoag_monitoring(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.drug, 'drug', ['warfarin','apixaban','rivaroxaban','dabigatran','edoxaban','heparin','enoxaparin','fondaparinux','argatroban','bivalirudin','other']);
  ensureNumber(req.dose, 'dose');
  ensureNumber(req.inr, 'inr');
  ensureNumber(req.days_on_drug, 'days');
  ensureBool(req.missed_doses, 'missed');
  ensureEnum(req.diet, 'diet', ['normal','low_vit_k','high_vit_k','variable','inconsistent','other']);
  let status;
  if (req.drug === 'warfarin' && req.inr < 2) status = 'inr_subtherapeutic_increase_dose';
  else if (req.drug === 'warfarin' && req.inr > 4) status = 'inr_supratherapeutic_hold_or_reduce';
  else if (req.missed_doses) status = 'missed_doses_counseling_required';
  else if (req.diet === 'variable') status = 'vit_k_intake_review_counsel';
  else status = 'anticoagulation_appropriate';
  return { status, drug: req.drug };
}

const CITATIONS = { ACC_AHA_AFIB_2024: 'ACC/AHA AFib 2024', HRS_2024: 'HRS 2024' };

function funcs() { return { afib_management, ablation, pacemaker, icd, anticoag_monitoring }; }
module.exports = { funcs, CITATIONS, ValidationError };