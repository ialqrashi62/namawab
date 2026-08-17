// filepath: tier20_research_ext_136_biobank_engine.js
// TIER20_RESEARCH_EXT-136: Biobank sample lifecycle
'use strict';

const CITATIONS = ['ISBER_2024','NIH_BEST_2024','FDA_21CFR11_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sample_collection(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureStr(req.subject_id, 'subject_id');
  ensureEnum(req.specimen_type, 'specimen_type', ['blood_serum','blood_plasma','blood_edta','blood_paxgene','urine','csf','tissue_ffpe','tissue_frozen','saliva','stool','bm','synovial','other']);
  ensureEnum(req.collection_tube, 'collection_tube', ['serum_separator','edta','heparin','citrate','paxgene_rna','cryotube','nunc_cryo','sterile_urine','other']);
  ensureNumber(req.volume_ml, 'volume_ml');
  ensureNumber(req.time_to_process_min, 'time_to_process_min');
  ensureBool(req.two_identifier_check, 'two_id_check');
  ensureBool(req.informed_consent_signed, 'consent_signed');

  let status;
  if (!req.two_identifier_check) status = 'two_identifier_required_pre_collection_blocking';
  else if (!req.informed_consent_signed) status = 'consent_required_blocking';
  else if (req.time_to_process_min > 240 && req.specimen_type.includes('blood')) status = 'over_4h_processing_review';
  else if (req.volume_ml < 1) status = 'volume_too_low_re_collect';
  else status = 'sample_collected';
  return { status, sample: req.sample_id };
}

function sample_storage(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureEnum(req.storage_type, 'storage_type', ['room_temp','4c','minus_20','minus_80','ln_vapor','ln_liquid','other']);
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureNumber(req.time_in_storage_days, 'days_in_storage');
  ensureBool(req.freezer_monitored, 'freezer_monitored');
  ensureNumber(req.last_temperature_excursion_count, 'temp_excursion_count');
  ensureEnum(req.aliquots_count, 'aliquots_count', ['one','two','three','four_plus','unknown','not_applicable','other']);

  let status;
  if (!req.freezer_monitored) status = 'freezer_monitoring_required';
  else if (req.temp_excursion_count > 0) status = 'temperature_excursion_review_quarantine';
  else if (req.time_in_storage_days > 3650 && req.storage_type === 'ln_liquid') status = 'over_10y_ln_liquid_review';
  else status = 'sample_storage_appropriate';
  return { status, type: req.storage_type };
}

function sample_quality(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureEnum(req.quality_metric, 'quality_metric', ['rna_integrity','dna_concentration','protein_concentration','cell_viability','purity_260_280','hemolysis_score','lipemia_score','cell_count','other']);
  ensureNumber(req.value, 'value');
  ensureNumber(req.threshold_pass, 'threshold_pass');
  ensureEnum(req.sample_status, 'sample_status', ['pass','fail','borderline','in_progress','not_run','other']);
  ensureBool(req.repeat_possible, 'repeat_possible');

  let status;
  if (req.sample_status === 'fail' && !req.repeat_possible) status = 'failed_irreparable_review';
  else if (req.value < req.threshold_pass && req.sample_status === 'pass') status = 'reported_pass_but_low_review';
  else if (req.sample_status === 'borderline') status = 'borderline_review_use_case';
  else status = 'sample_quality_pass';
  return { status, status_name: req.sample_status };
}

function sample_chain_of_custody(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureStr(req.from_user, 'from_user');
  ensureStr(req.to_user, 'to_user');
  ensureBool(req.transfer_documented, 'transfer_documented');
  ensureBool(req.temp_maintained, 'temp_maintained');
  ensureBool(req.electronic_signature, 'e_sign');
  ensureNumber(req.humidity_logged, 'humidity_pct');

  let status;
  if (!req.transfer_documented) status = 'transfer_documentation_required';
  else if (!req.temp_maintained) status = 'temperature_break_blocking';
  else if (!req.electronic_signature) status = 'electronic_signature_required_21cfr11';
  else status = 'chain_of_custody_complete';
  return { status, from: req.from_user };
}

function sample_disposal(req) {
  ensureStr(req.sample_id, 'sample_id');
  ensureEnum(req.disposal_reason, 'disposal_reason', ['study_end','consent_withdrawn','quality_fail','no_specimen','excess_specimen','regulatory_requirement','safety','other']);
  ensureBool(req.consent_withdrawal_check, 'consent_withdrawal_check');
  ensureBool(req.regulatory_hold_check, 'regulatory_hold_check');
  ensureBool(req.documented_destruction, 'documented_destruction');
  ensureNumber(req.retention_complete_days, 'retention_days');

  let status;
  if (!req.consent_withdrawal_check) status = 'consent_withdrawal_check_required';
  else if (!req.regulatory_hold_check) status = 'regulatory_hold_check_required';
  else if (!req.documented_destruction) status = 'documented_destruction_required';
  else if (req.retention_days < 30 && req.disposal_reason === 'study_end') status = 'premature_disposal_review';
  else status = 'sample_disposed';
  return { status, reason: req.disposal_reason };
}

function funcs() { return { sample_collection, sample_storage, sample_quality, sample_chain_of_custody, sample_disposal }; }
module.exports = { funcs, CITATIONS, ValidationError };