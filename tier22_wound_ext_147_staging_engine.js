// filepath: tier22_wound_ext_147_staging_engine.js
// TIER22_WOUND_EXT-147: Wound staging (NPUAP, Wagner, Texas)
'use strict';

const CITATIONS = ['NPUAP_2024','WAGNER_2024','TEXAS_2024','WUWHS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function wound_pressure_stage(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.npuap_stage, 'npuap_stage', ['stage_1','stage_2','stage_3','stage_4','unstageable','suspected_deep_tissue_injury','medical_device_related','mucosal_membrane','no_pressure_injury','other']);
  ensureBool(req.non_blanchable_erythema, 'non_blanchable');
  ensureBool(req.partial_thickness_skin_loss, 'partial_loss');
  ensureBool(req.full_thickness_skin_loss, 'full_loss');
  ensureBool(req.tissue_exposed, 'tissue_exposed');
  ensureBool(req.slough_present, 'slough');
  ensureBool(req.eschar_present, 'eschar');

  let status;
  if (req.npuap_stage === 'unstageable') status = 'unstageable_remove_eschar_to_stage';
  else if (req.npuap_stage === 'suspected_deep_tissue_injury' && req.tissue_exposed) status = 'suspected_dti_may_evolve';
  else if (req.npuap_stage === 'stage_4' && req.tissue_exposed) status = 'stage_4_full_thickness';
  else status = 'stage_classified';
  return { status, stage: req.npuap_stage };
}

function wound_wagner(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.wagner_grade, 'wagner_grade', ['grade_0_pre_ulcerative','grade_1_superficial','grade_2_deep_to_tendon','grade_3_deep_to_bone','grade_4_localized_gangrene','grade_5_gangrene_of_foot','other']);
  ensureBool(req.tendon_exposed, 'tendon_exposed');
  ensureBool(req.bone_exposed, 'bone_exposed');
  ensureBool(req.abscess_present, 'abscess');
  ensureBool(req.osteomyelitis, 'osteomyelitis');

  let status;
  if (req.wagner_grade === 'grade_5_gangrene_of_foot') status = 'grade_5_extensive_gangrene_amputation_review';
  else if (req.wagner_grade === 'grade_4_localized_gangrene') status = 'grade_4_localized_gangrene_vascular_review';
  else if (req.osteomyelitis && (req.wagner_grade === 'grade_3_deep_to_bone' || req.wagner_grade === 'grade_4_localized_gangrene')) status = 'osteomyelitis_imaging_and_culture';
  else if (req.wagner_grade === 'grade_0_pre_ulcerative' && req.tendon_exposed) status = 'pre_ulcerative_with_exposure_review';
  else status = 'wagner_graded';
  return { status, grade: req.wagner_grade };
}

function wound_texas(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.texas_grade, 'texas_grade', ['grade_0_pre_or_post_ulcerative','grade_1_superficial','grade_2_to_tendon_capsule_bone','grade_3_deep_to_bone_or_joint','other']);
  ensureEnum(req.texas_stage, 'texas_stage', ['stage_a_clean','stage_b_non_ischemic_infected','stage_c_ischemic','stage_d_ischemic_infected','other']);
  ensureBool(req.infection_present, 'infection');
  ensureBool(req.ischemia_present, 'ischemia');
  ensureNumber(req.depth_cm, 'depth_cm');

  let status;
  if (req.texas_stage === 'stage_d_ischemic_infected' && req.texas_grade === 'grade_3_deep_to_bone_or_joint') status = 'texas_3d_highest_risk_amputation';
  else if (req.ischemia && req.infection) status = 'ischemia_plus_infection_high_risk';
  else if (req.texas_grade === 'grade_3_deep_to_bone_or_joint') status = 'deep_to_bone_imaging_required';
  else status = 'texas_classified';
  return { status, grade: req.texas_grade };
}

function wound_burn(req) {
  ensureStr(req.burn_id, 'burn_id');
  ensureEnum(req.burn_depth, 'burn_depth', ['first_superficial','second_partial_superficial','second_partial_deep','third_full_thickness','fourth_deeper','other']);
  ensureNumber(req.tbsa_pct, 'tbsa_pct');
  ensureBool(req.airway_involvement, 'airway');
  ensureBool(req.inhalation_injury, 'inhalation');
  ensureBool(req.circumferential, 'circumferential');

  let status;
  if (req.airway_involvement || req.inhalation) status = 'airway_or_inhalation_intubation_review';
  else if (req.tbsa_pct > 30) status = 'over_30pct_tbsa_transfer_burn_center';
  else if (req.circumferential && req.burn_depth === 'third_full_thickness') status = 'circumferential_third_escharotomy_review';
  else if (req.burn_depth === 'fourth_deeper') status = 'fourth_deepest_graft_required';
  else status = 'burn_classified';
  return { status, depth: req.burn_depth };
}

function wound_surgical(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.wound_class, 'wound_class', ['clean','clean_contaminated','contaminated','dirty_infected','other']);
  ensureEnum(req.healing_phase, 'healing_phase', ['inflammatory','proliferative','remodeling','maturation','stuck_inflammatory','stuck_proliferative','dehisced','not_applicable','other']);
  ensureBool(req.fascia_closed, 'fascia_closed');
  ensureBool(req.skin_closed, 'skin_closed');
  ensureNumber(req.days_post_op, 'days_post_op');

  let status;
  if (req.wound_class === 'dirty_infected') status = 'dirty_infected_open_pack_review';
  else if (req.healing_phase === 'dehisced') status = 'dehiscence_immediate_intervention';
  else if (req.healing_phase === 'stuck_inflammatory' && req.days_post_op > 7) status = 'stuck_inflammatory_over_7d_review';
  else if (!req.fascia_closed && req.wound_class === 'clean') status = 'fascia_required_to_close';
  else status = 'surgical_wound_classified';
  return { status, class: req.wound_class };
}

function funcs() { return { wound_pressure_stage, wound_wagner, wound_texas, wound_burn, wound_surgical }; }
module.exports = { funcs, CITATIONS, ValidationError };
