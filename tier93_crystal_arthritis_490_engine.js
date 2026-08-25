// filepath: tier93_crystal_arthritis_490_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gout_acute(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.attack_duration_days, 'add');
  ensureBool(req.monosodium_urate_crystals, 'msu');
  ensureStr(req.joint, 'joint');
  ensureNum(req.inflammation_score, 'inf');
  ensureNum(req.pain_score, 'pain');
  ensureBool(req.nsaid_used, 'nsaid');
  ensureBool(req.colchicine_used, 'colch');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function gout_chronic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.tophi_count, 'tc');
  ensureNum(req.serum_urate, 'su');
  ensureNum(req.attacks_per_year, 'apy');
  ensureBool(req.imaging_erosions, 'ie');
  ensureBool(req.ult_dosing, 'ult');
  ensureNum(req.allopurinol_dose, 'ald');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function cppd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.joint, 'joint');
  ensureBool(req.cppd_crystals, 'cc');
  ensureBool(req.chondrocalcinosis, 'chond');
  ensureNum(req.secondary_causes, 'sc');
  ensureBool(req.acute_attack, 'aa');
  ensureNum(req.joint_fluid_cells, 'jfc');
  ensureEnum(req.treatment, 'tx', ['nsaid','colchicine','steroid','nsaid','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function basic_calcium_phosphate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.joint, 'joint');
  ensureBool(req.bcp_crystals, 'bcp');
  ensureBool(req.hydroxapatite, 'ha');
  ensureNum(req.osteoarthritis_severity, 'oas');
  ensureBool(req.mri_edema, 'me');
  ensureEnum(req.treatment, 'tx', ['nsaid','intraarticular_steroid','viscosupplementation','physical_therapy','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function crystal_synovial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fluid_id, 'fid');
  ensureNum(req.wbc_count, 'wc');
  ensureEnum(req.crystals, 'cry', ['msu','cppd','bcp','oxalate','lipid','none','other','unknown']);
  ensureStr(req.crystal_appearance, 'capp');
  ensureEnum(req.polarization, 'pol', ['pos_birefringent','neg_birefringent','non_birefringent','other','unknown','none']);
  ensureEnum(req.fluid_culture, 'fc', ['positive','negative','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { fid: req.fluid_id };
}

function funcs() { return { gout_acute, gout_chronic, cppd, basic_calcium_phosphate, crystal_synovial }; }
module.exports = { funcs, ValidationError };
