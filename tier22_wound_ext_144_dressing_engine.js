// filepath: tier22_wound_ext_144_dressing_engine.js
// TIER22_WOUND_EXT-144: Wound dressing, NPWT, compression
'use strict';

const CITATIONS = ['WUWHS_2024','NPUAP_2024','CMS_WOUND_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dressing_select(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.dressing_type, 'dressing_type', ['gauze','hydrocolloid','hydrogel','foam','transparent_film','alginate','collagen','silver_iodine','honey','methylene_blue','cadexomer','absorptive','contact_layer','composite','other']);
  ensureEnum(req.exudate_amount, 'exudate_amount', ['none','scant','small','moderate','large','copious','other']);
  ensureBool(req.controlled_donation, 'controlled_donation');
  ensureBool(req.cavity_wound, 'cavity');
  ensureBool(req.infection_present, 'infection');

  let status;
  if (req.dressing_type === 'gauze' && req.exudate_amount === 'copious') status = 'gauze_overwhelmed_use_absorptive';
  else if (req.infection_present && !['silver_iodine','honey','methylene_blue','cadexomer'].includes(req.dressing_type)) status = 'infection_use_antimicrobial_dressing';
  else if (req.cavity && !['alginate','hydrocolloid','hydrogel','foam'].includes(req.dressing_type)) status = 'cavity_needs_filler_dressing';
  else status = 'dressing_appropriate';
  return { status, type: req.dressing_type };
}

function dressing_change(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.days_since_change, 'days_since_change');
  ensureNumber(req.change_frequency_target_days, 'target_freq');
  ensureBool(req.dressing_intact, 'dressing_intact');
  ensureBool(req.saturated, 'saturated');
  ensureBool(req.leaking, 'leaking');
  ensureBool(req.removed_early, 'removed_early');

  let status;
  if (req.saturated && req.days_since_change < req.change_frequency_target_days) status = 'premature_saturation_review_frequency_or_choose_absorptive';
  else if (req.leaking) status = 'leakage_review_seal';
  else if (!req.dressing_intact && req.days_since_change < req.change_frequency_target_days) status = 'dressing_not_intact_review_application';
  else if (req.removed_early) status = 'early_removal_documented';
  else status = 'dressing_change_appropriate';
  return { status, days: req.days_since_change };
}

function dressing_npwt(req) {
  ensureStr(req.npwt_id, 'npwt_id');
  ensureNumber(req.pressure_mmhg, 'pressure_mmhg');
  ensureEnum(req.pressure_mode, 'pressure_mode', ['continuous','intermittent','other']);
  ensureNumber(req.hours_since_change, 'hours_since_change');
  ensureBool(req.seal_intact, 'seal_intact');
  ensureNumber(req.fluid_collection_ml, 'fluid_collection_ml');
  ensureEnum(req.wound_class, 'wound_class', ['stage_3','stage_4','dehisced','graft','flap','mixed','other']);

  let status;
  if (!req.seal_intact) status = 'seal_lost_repair_immediately';
  else if (req.pressure_mmhg > 200) status = 'over_200_mmhg_review_protocol';
  else if (req.pressure_mmhg < 75) status = 'under_75_mmhg_check_settings';
  else if (req.hours_since_change > 96) status = 'over_96h_change_per_protocol';
  else if (req.fluid_collection_ml < 50) status = 'low_fluid_review_kink';
  else status = 'npwt_appropriate';
  return { status, pressure: req.pressure_mmhg };
}

function dressing_compression(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.compression_mmhg, 'compression_mmhg');
  ensureEnum(req.wrap_type, 'wrap_type', ['short_stretch','long_stretch','multilayer','unna_boot','tubular','other']);
  ensureBool(req.arterial_supply_confirmed, 'arterial_supply');
  ensureBool(req.dressing_intact, 'dressing_intact');
  ensureNumber(req.days_until_next_change, 'days_until_change');

  let status;
  if (!req.arterial_supply_confirmed) status = 'arterial_supply_required_pre_compression';
  else if (req.compression_mmhg > 40 && req.wrap_type === 'short_stretch') status = 'over_40mmhg_short_stretch_review';
  else if (!req.dressing_intact) status = 'compression_intact_required';
  else status = 'compression_appropriate';
  return { status, mmhg: req.compression_mmhg };
}

function dressing_assess(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureBool(req.periwound_skin_intact, 'periwound_intact');
  ensureBool(req.maceration_present, 'maceration');
  ensureBool(req.tape_blister, 'tape_blister');
  ensureBool(req.allergies_documented, 'allergies');
  ensureBool(req.dressing_product_match, 'product_match');

  let status;
  if (req.maceration) status = 'maceration_review_dressing_breathable_or_change_more_frequent';
  else if (req.tape_blister) status = 'tape_blister_change_securement_method';
  else if (!req.allergies_documented) status = 'product_allergies_documented';
  else if (!req.periwound_skin_intact) status = 'periwound_skin_review';
  else if (!req.product_match) status = 'product_does_not_match_wound_review';
  else status = 'dressing_assessment_appropriate';
  return { status, intact: req.periwound_skin_intact };
}

function funcs() { return { dressing_select, dressing_change, dressing_npwt, dressing_compression, dressing_assess }; }
module.exports = { funcs, CITATIONS, ValidationError };
