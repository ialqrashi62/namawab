// filepath: tier93_spondyloarthropathy_489_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ankylosing_spondylitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.axs_as_score, 'aas');
  ensureNum(req.basdai_score, 'bdi');
  ensureNum(req.basfi_score, 'bfi');
  ensureBool(req.mri_sacroiliitis, 'msi');
  ensureBool(req.hla_b27_positive, 'h27');
  ensureBool(req.enthesitis_present, 'ep');
  ensureBool(req.uveitis_history, 'uh');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function psoriatic_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.psoriasis_duration_years, 'pdy');
  ensureEnum(req.psoriasis_severity, 'ps', ['mild','moderate','severe','unknown','other']);
  ensureEnum(req.arthritis_pattern, 'ap', ['oligoarticular','polyarticular','axial','mutilans','distal','mixed','other','unknown']);
  ensureNum(req.dapsa_score, 'dap');
  ensureNum(req.caspar_score, 'cas');
  ensureBool(req.mri_sacroiliitis, 'msi');
  ensureBool(req.nail_lesions, 'nl');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ibd_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.ibd_type, 'it', ['crohns','ulcerative_colitis','indeterminate','other','unknown']);
  ensureEnum(req.arthritis_pattern, 'ap', ['axial','peripheral','mixed','other','unknown']);
  ensureBool(req.peripheral_arthritis, 'pa');
  ensureBool(req.sac_iliitis, 'si');
  ensureEnum(req.disease_activity, 'da', ['remission','mild','moderate','severe','unknown','other']);
  ensureEnum(req.biologic_type, 'bt', ['anti_tnf','ustekinumab','vedolizumab','none','other','unknown']);
  ensureNum(req.clinical_response, 'cr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function reactive_arthritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.trigger_organism, 'tri');
  ensureNum(req.time_to_arthritis_weeks, 'ttar');
  ensureEnum(req.pattern, 'pat', ['migratory','additive','intermittent','other','unknown']);
  ensureBool(req.urogenital_infection, 'ui');
  ensureNum(req.reiter_features, 'rf');
  ensureBool(req.hla_b27, 'h27');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function enthesitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.enthesitis_count, 'ec');
  ensureNum(req.mases_score, 'mas');
  ensureNum(req.dactylitis_count, 'dac');
  ensureBool(req.achilles_involvement, 'ach');
  ensureBool(req.plantar_fasciitis, 'pf');
  ensureBool(req.ultrasound_active, 'ua');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { ankylosing_spondylitis, psoriatic_arthritis, ibd_arthritis, reactive_arthritis, enthesitis }; }
module.exports = { funcs, ValidationError };
