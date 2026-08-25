// filepath: tier53_oncology_ext_302_onc_heme_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function aml(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.subtype, 'sub', ['de_novo','secondary_t_aml','therapy_related','down_syndrome_related']);
  ensureEnum(req.cytogenetics, 'cyt', ['favorable','intermediate_risk','adverse_risk','normal_karyotype']);
  ensureStr(req.induction, 'ind');
  ensureEnum(req.response, 'resp', ['morphologic_remission','partial_remission','no_response','resistant_disease']);
  ensureStr(req.consolidation, 'cons');
  return { subtype: req.subtype };
}
function all(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['b_cell_ph_negative','b_cell_ph_positive','t_cell','mature_b_cell_burkitt','mixed_phenotype']);
  ensureNum(req.age, 'age');
  ensureEnum(req.risk, 'rk', ['standard','high','very_high','infant']);
  ensureStr(req.induction, 'ind');
  ensureEnum(req.response, 'resp', ['end_induction_mrd_negative','end_induction_mrd_positive','partial_response','no_response']);
  ensureNum(req.maintenance_phase_yr, 'mph');
  return { type: req.type };
}
function cml(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.phase, 'ph', ['chronic','accelerated','blast_crisis','post_blast']);
  ensureStr(req.bcr_abl, 'ba');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.molecular_response_qtr, 'mr');
  ensureEnum(req.response, 'resp', ['no_response','partial_cytogenetic','complete_cytogenetic','major_molecular','deep_response_major_molecular']);
  return { phase: req.phase };
}
function cll(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rai_stage, 'rs', ['0','i','ii','iii','iv']);
  ensureEnum(req.tp53, 'tp53', ['unmutated','deleted','mutated','deleted_and_mutated']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['stable_disease','partial_response','complete_response','progression','minimal_residual_disease_negative']);
  ensureNum(req.follow_up, 'fu');
  return { rai: req.rai_stage };
}
function nhl_lymphoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['diffuse_large_b_cell','follicular','mantle_cell','burkitt','peripheral_t_cell','hodgkin_classical','hodgkin_nodular_lymphocyte_predominant']);
  ensureStr(req.stage, 'stage');
  ensureNum(req.ipi, 'ipi');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.interim_response, 'ir', ['complete_response','partial_response','stable','progression']);
  ensureEnum(req.final_response, 'fr', ['complete_remission','partial_remission','stable_disease','progression','relapse']);
  return { type: req.type };
}

function funcs() { return { aml, all, cml, cll, nhl_lymphoma }; }
module.exports = { funcs, ValidationError };