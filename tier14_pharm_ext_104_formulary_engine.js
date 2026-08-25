// filepath: tier14_pharm_ext_104_formulary_engine.js
// TIER14_PHARM_EXT-104: Formulary & therapeutic interchange
'use strict';

const CITATIONS = ['ASHP_FORMULARY_2024','WHO_EML_2024','SFDA_FORMULARY_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function formulary_lookup(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.formulary_status, 'formulary_status', ['formulary_open','formulary_restricted','formulary_with_restriction','non_formulary','investigational','emergency_use','expired','pending_review','not_in_system','other']);
  ensureEnum(req.tier, 'tier', ['tier_1_generic','tier_2_preferred_brand','tier_3_non_preferred_brand','tier_4_specialty','tier_6_medical_','excluded','not_applicable','other']);
  ensureBool(req.requires_prior_auth, 'requires_prior_auth');
  ensureBool(req.has_quantity_limit, 'has_quantity_limit');
  ensureNumber(req.quantity_limit_per_30d, 'quantity_limit_per_30d');

  let status;
  if (req.formulary_status === 'non_formulary') status = 'non_formulary_alternative_recommended';
  else if (req.formulary_status === 'expired') status = 'expired_review_renewal';
  else if (req.formulary_status === 'pending_review') status = 'pending_review_use_with_caution';
  else if (req.formulary_status === 'investigational' && !req.requires_prior_auth) status = 'investigational_requires_prior_auth';
  else if (req.requires_prior_auth && req.has_quantity_limit && req.quantity_limit_per_30d < 30) status = 'restricted_and_quantity_limited';
  else status = 'formulary_lookup_complete';
  return { status, tier: req.tier };
}

function formulary_interchange(req) {
  ensureStr(req.prescribed_medication_id, 'prescribed_medication_id');
  ensureEnum(req.interchange_rule, 'interchange_rule', ['automatic_therapeutic_substitution','requires_provider_approval','cost_based','formulary_alignment','none','other']);
  ensureStr(req.alternative_medication_id, 'alternative_medication_id');
  ensureBool(req.same_class, 'same_class');
  ensureBool(req.same_dose, 'same_dose');
  ensureBool(req.bioequivalent, 'bioequivalent');
  ensureNumber(req.cost_savings_pct, 'cost_savings_pct');

  let status;
  if (req.interchange_rule === 'none') status = 'no_interchange_performed';
  else if (req.interchange_rule === 'automatic_therapeutic_substitution' && !req.same_class) status = 'therapeutic_substitution_requires_same_class';
  else if (req.interchange_rule === 'automatic_therapeutic_substitution' && !req.same_dose) status = 'automatic_substitution_requires_dose_equivalence';
  else if (req.interchange_rule === 'automatic_therapeutic_substitution' && !req.bioequivalent) status = 'automatic_substitution_requires_bioequivalence';
  else if (req.interchange_rule === 'requires_provider_approval' && req.cost_savings_pct < 10) status = 'minimal_savings_provider_approval_review';
  else if (req.cost_savings_pct >= 30 && req.bioequivalent) status = 'high_savings_substitute_approved';
  else status = 'interchange_proposed';
  return { status, alternative: req.alternative_medication_id };
}

function prior_auth_check(req) {
  ensureStr(req.order_id, 'order_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.pa_status, 'pa_status', ['not_required','pending_review','approved','denied','expired','urgent_approved','retrospective_review','appealed','other']);
  ensureNumber(req.days_to_decision, 'days_to_decision');
  ensureBool(req.documented_medical_necessity, 'documented_medical_necessity');
  ensureEnum(req.diagnosis_match, 'diagnosis_match', ['pa_match', 'pa_off_label','pa_partial','pa_none','unknown','other']);

  let status;
  if (req.pa_status === 'not_required') status = 'no_prior_auth_required';
  else if (req.pa_status === 'denied') status = 'pa_denied_alternative_recommended';
  else if (req.pa_status === 'pending_review' && req.days_to_decision > 3) status = 'pa_pending_over_3d_expedite';
  else if (req.pa_status === 'expired') status = 'pa_expired_renewal_required';
  else if (req.pa_status === 'pending_review' && !req.documented_medical_necessity) status = 'pa_pending_medical_necessity_required';
  else if (req.diagnosis_match === 'pa_off_label' && !req.documented_medical_necessity) status = 'off_label_use_medical_necessity_required';
  else status = 'pa_active';
  return { status, pa: req.pa_status };
}

function formulary_therapeutic_class(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.therapeutic_class, 'therapeutic_class', ['antibiotic_penicillin','antibiotic_cephalosporin','antibiotic_macrolide','antibiotic_fluoroquinolone','antibiotic_vancomycin','anticoagulant_heparin','anticoagulant_warfarin','anticoagulant_doa','antihypertensive_ace','antihypertensive_arb','antidiabetic_metformin','antidiabetic_insulin','statin','ssri','snri','tricyclic','maoi','nsaid','opioid_strong','opiate_weak','benzo_long','benzo_short','steroid_systemic','steroid_inhaled','immunosuppressant','biologic','other']);
  ensureNumber(req.within_class_count, 'within_class_count');
  ensureEnum(req.first_line_band, 'first_line_band', ['first_line','second_line','third_line_plus','specialty_only','not_recommended','other']);
  ensureBool(req.guideline_concordant, 'guideline_concordant');

  let status;
  if (req.first_line_band === 'not_recommended') status = 'not_recommended_for_first_line';
  else if (req.first_line_band === 'first_line' && !req.guideline_concordant) status = 'first_line_should_be_guideline_concordant';
  else if (req.first_line_band === 'specialty_only' && req.within_class_count > 0) status = 'specialty_only_alternative_within_class_available';
  else status = 'class_review_complete';
  return { status, class: req.therapeutic_class };
}

function formulary_drug_shortage(req) {
  ensureStr(req.medication_id, 'medication_id');
  ensureEnum(req.shortage_status, 'shortage_status', ['no_shortage','potential_shortage','shortage_active','supply_interrupted','resolved','discontinued','allocation_only','other']);
  ensureNumber(req.days_supply_remaining, 'days_supply_remaining');
  ensureNumber(req.backorder_days, 'backorder_days');
  ensureStr(req.alternative_medication_id, 'alternative_medication_id');

  let status;
  if (req.shortage_status === 'no_shortage') status = 'no_shortage';
  else if (req.shortage_status === 'discontinued') status = 'discontinued_permanent_substitution';
  else if (req.shortage_status === 'allocation_only' && req.days_supply_remaining < 30) status = 'allocation_tight_supply_review';
  else if (req.shortage_status === 'shortage_active' && req.backorder_days > 30) status = 'extended_shortage_substitute_recommended';
  else if (req.shortage_status === 'shortage_active' && !req.alternative_medication_id) status = 'shortage_no_alternative_review_p_and_t';
  else if (req.shortage_status === 'supply_interrupted') status = 'supply_interrupted_emergency_substitution';
  else status = 'shortage_managed';
  return { status, shortage: req.shortage_status };
}

function funcs() { return { formulary_lookup, formulary_interchange, prior_auth_check, formulary_therapeutic_class, formulary_drug_shortage }; }
module.exports = { funcs, CITATIONS, ValidationError };