// filepath: tier30_hematology_ext_183_transfusion_engine.js
// TIER30_HEMATOLOGY-183: Blood banking, transfusion
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function blood_type_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.abo, 'abo', ['A','B','AB','O','unknown']);
  ensureEnum(req.rh, 'rh', ['positive','negative','unknown']);
  ensureEnum(req.antibody_screen, 'antibody_screen', ['negative','positive','inconclusive']);
  ensureBool(req.previous_transfusion, 'prev_tx');
  let status;
  if (req.antibody_screen === 'positive') status = 'antibody_identified_extended_panel_needed';
  else if (req.previous_transfusion && req.antibody_screen === 'inconclusive') status = 'inconclusive_repeat_sample';
  else status = 'blood_type_confirmed';
  return { status, abo: req.abo + '_' + req.rh };
}

function crossmatch(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureEnum(req.recipient_abo, 'rec_abo', ['A','B','AB','O']);
  ensureEnum(req.recipient_rh, 'rec_rh', ['positive','negative']);
  ensureEnum(req.donor_abo, 'don_abo', ['A','B','AB','O']);
  ensureEnum(req.donor_rh, 'don_rh', ['positive','negative']);
  ensureEnum(req.crossmatch, 'crossmatch', ['compatible','incompatible_major','incompatible_minor','equivocal']);
  ensureEnum(req.antibody_identified, 'ab_id', ['none','anti_D','anti_Kell','anti_Fy_a','anti_Jk_a','multiple','other']);
  let status;
  if (req.crossmatch !== 'compatible') status = 'incompatible_unit_dont_transfuse';
  else if (req.recipient_abo !== req.donor_abo) status = 'ab0_mismatch_review_immediate';
  else if (req.antibody_identified === 'anti_Kell' && req.donor_abo === 'A') status = 'kell_antigen_possible_review_phenotype_match';
  else status = 'crossmatch_compatible_issue_unit';
  return { status, compatible: req.crossmatch };
}

function prbc_transfusion(req) {
  ensureStr(req.transfusion_id, 'transfusion_id');
  ensureStr(req.unit_number, 'unit_number');
  ensureEnum(req.blood_group, 'bg', ['O_negative','O_positive','A_negative','A_positive','B_negative','B_positive','AB_negative','AB_positive']);
  ensureNumber(req.volume_ml, 'volume');
  ensureNumber(req.hgb_pre, 'hgb_pre');
  ensureBool(req.symr_reaction, 'reaction');
  ensureBool(req.pre_meds, 'pre_meds');
  let status;
  if (req.symr_reaction) status = 'transfusion_reaction_stop_immediate_workup';
  else if (req.hgb_pre < 7) status = 'appropriate_transfusion_severe_anemia';
  else if (req.hgb_pre >= 7 && req.hgb_pre < 8) status = 'transfusion_appropriate_restrictive_strategy';
  else if (req.hgb_pre >= 8) status = 'transfusion_above_restrictive_threshold_review';
  else status = 'transfusion_completed';
  return { status, units: 1, hgb: req.hgb_pre };
}

function platelet_transfusion(req) {
  ensureStr(req.transfusion_id, 'transfusion_id');
  ensureEnum(req.unit_type, 'unit_type', ['apheresis','whole_blood_derived','pooled','other']);
  ensureNumber(req.platelet_count, 'plt_count');
  ensureNumber(req.plt_pre, 'plt_pre');
  ensureNumber(req.plt_post, 'plt_post');
  ensureBool(req.reaction, 'reaction');
  ensureEnum(req.indications, 'indication', ['prophylactic','active_bleeding','pre_procedure','invasive_procedure','other']);
  let status;
  const cci = (req.plt_post - req.plt_pre) * req.platelet_count / req.platelet_count;
  if (req.reaction) status = 'transfusion_reaction_stop_workup';
  else if (cci < 5000) status = 'poor_increment_evaluate_refractoriness';
  else if (req.indications === 'prophylactic' && req.plt_pre < 10) status = 'prophylactic_transfusion_threshold_met';
  else if (req.indications === 'active_bleeding') status = 'therapeutic_transfusion_active_bleeding';
  else status = 'platelet_transfusion_completed';
  return { status, cci: cci };
}

function plasma_transfusion(req) {
  ensureStr(req.transfusion_id, 'transfusion_id');
  ensureEnum(req.plasma_type, 'plasma_type', ['ffp','pf24','sd_plasma','other']);
  ensureNumber(req.volume_ml, 'volume');
  ensureNumber(req.inr_pre, 'inr_pre');
  ensureNumber(req.inr_post, 'inr_post');
  ensureBool(req.reaction, 'reaction');
  ensureEnum(req.indications, 'indication', ['warfarin_reversal','liver_failure_coagulopathy','d_ic','massively_transfused','bleeding_coagulopathy','other']);
  let status;
  if (req.reaction) status = 'transfusion_reaction_stop_workup';
  else if (req.inr_pre > 1.5 && req.inr_post > 1.5) status = 'inadequate_correction_repeat_dose';
  else if (req.inr_pre >= 1.5 && req.inr_post < 1.5) status = 'inr_corrected_plasma_effective';
  else status = 'plasma_transfusion_completed';
  return { status, inr_delta: req.inr_pre - req.inr_post };
}

function funcs() { return { blood_type_screen, crossmatch, prbc_transfusion, platelet_transfusion, plasma_transfusion }; }
module.exports = { funcs, ValidationError };