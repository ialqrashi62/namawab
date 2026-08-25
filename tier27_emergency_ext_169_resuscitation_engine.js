// filepath: tier27_emergency_ext_169_resuscitation_engine.js
// TIER27_EMERGENCY-169: Resuscitation (ACLS, ATLS, code blue, sepsis bundle)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function acls(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.rhythm, 'rhythm', ['vf','pulseless_vt','pea','asystole','sinus','sinus_tachycardia','svt','afib','unknown','other']);
  ensureBool(req.cpr_started, 'cpr');
  ensureNumber(req.epinephrine_doses, 'epi');
  ensureNumber(req.minutes_down, 'minutes');
  ensureBool(req.shockable, 'shockable');
  ensureEnum(req.outcome, 'outcome', ['rosc','ongoing','death','unknown','other']);
  let status;
  if (req.outcome === 'rosc') status = 'rosc_post_care_targeted_temp';
  else if (req.outcome === 'death') status = 'death_time_documented_family_notified';
  else if (req.shockable && req.epinephrine_doses === 0) status = 'shockable_first_shock_then_epi';
  else if (req.rhythm === 'pea' && req.minutes_down > 30) status = 'pea_prolonged_review_5h5t_reversible_causes';
  else status = 'acls_in_progress';
  return { status, rhythm: req.rhythm };
}

function sepsis_bundle(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.lactate, 'lactate');
  ensureBool(req.blood_culture_drawn, 'culture');
  ensureBool(req.broad_spectrum_abx, 'abx');
  ensureNumber(req.fluid_bolus_ml, 'fluid');
  ensureBool(req.vasopressor_needed, 'vaso');
  ensureNumber(req.map, 'map');
  let status;
  if (req.lactate > 4) status = 'high_lactate_repeat_lactate_30ml_kg_fluid';
  else if (!req.blood_culture_drawn || !req.broad_spectrum_abx) status = 'sepsis_bundle_incomplete_culture_abx_within_1h';
  else if (req.fluid_bolus_ml < 30) status = 'inadequate_fluid_bolus_give_30ml_kg';
  else if (req.vaso_needed && req.map < 65) status = 'map_low_vasopressor_norepinephrine';
  else status = 'sepsis_bundle_complete';
  return { status, lactate: req.lactate };
}

function stroke_alert(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.last_known_well_min, 'lkw');
  ensureNumber(req.nihss, 'nihss');
  ensureBool(req.ct_done, 'ct');
  ensureBool(req.cta_done, 'cta');
  ensureBool(req.iv_thrombolytic_given, 'tpa');
  ensureBool(req.thrombectomy, 'thrombectomy');
  let status;
  if (req.last_known_well_min > 270 && !req.tpa) status = 'lkw_over_4_5h_tpa_contraindicated';
  else if (req.last_known_well_min <= 270 && !req.tpa) status = 'within_window_review_tpa_exclusion';
  else if (req.nihss >= 6 && !req.cta_done) status = 'large_vessel_occlusion_suspicion_cta_required';
  else if (req.tpa && req.thrombectomy === false && req.nihss >= 6) status = 'consider_thrombectomy_lvo';
  else status = 'stroke_alert_reviewed';
  return { status, nihss: req.nihss };
}

function massive_transfusion(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.blood_loss_ml, 'loss');
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.base_excess, 'be');
  ensureNumber(req.prbc_units, 'prbc');
  ensureNumber(req.ffp_units, 'ffp');
  ensureNumber(req.platelets_units, 'plt');
  let status;
  if (req.sbp < 90 && req.hr > 120) status = 'hemorrhagic_shock_mtp_activate';
  else if (req.prbc_units >= 4 && req.ffp_units < req.prbc_units / 3) status = 'inadequate_ffp_review_ratio';
  else if (req.be < -6) status = 'profound_acidosis_review_mtp';
  else status = 'transfusion_protocol_reviewed';
  return { status, prbc: req.prbc_units };
}

function code_blue(req) {
  ensureStr(req.event_id, 'event_id');
  ensureEnum(req.location, 'location', ['ed','icu','ward','or','pacu','procedural','lobby','other']);
  ensureNumber(req.minutes_down, 'minutes');
  ensureBool(req.compressions_quality, 'compressions');
  ensureNumber(req.defibrillation_count, 'defib');
  ensureEnum(req.outcome, 'outcome', ['rosc','ongoing','terminated','death','unknown','other']);
  let status;
  if (req.outcome === 'rosc') status = 'rosc_post_care_targeted_temp';
  else if (req.outcome === 'terminated') status = 'termination_documented_family_notification';
  else if (req.minutes_down > 30 && req.outcome === 'ongoing') status = 'long_downtime_review_termination';
  else if (!req.compressions_quality) status = 'compression_quality_review_cpr_coach';
  else status = 'code_blue_in_progress';
  return { status, outcome: req.outcome };
}

const CITATIONS = { AHA_ACLS_2024: 'AHA ACLS 2024', SSC_2021: 'Surviving Sepsis 2021', AHA_STROKE_2024: 'AHA Stroke 2024' };

function funcs() { return { acls, sepsis_bundle, stroke_alert, massive_transfusion, code_blue }; }
module.exports = { funcs, CITATIONS, ValidationError };