// filepath: tier77_neuro_ext_411_neuro_neuromuscular_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function neuropathy_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.neuropathy_type, 'nt', ['diabetic','idiopathic','alcoholic','b12_deficiency','autoimmune','hereditary','drug_induced','guillain_barre','cidp','other','unknown']);
  ensureNum(req.mrc_sum_score, 'mss');
  ensureBool(req.sensation_intact, 'si');
  ensureEnum(req.reflexes, 'ref', ['normal','reduced','absent','hyperactive','brisk','ankle_reduced','global_reduced','unknown','other']);
  ensureNum(req.ck_level, 'ckl');
  ensureStr(req.nerve_conduction_findings, 'ncf');
  ensureStr(req.skin_biopsy_result, 'sbr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function myasthenia_gravis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.mg_adl_score, 'mas');
  ensureNum(req.mg_qmg_score, 'mqs');
  ensureBool(req.acetylcholine_receptor_ab, 'ara');
  ensureBool(req.musk_ab, 'mab');
  ensureNum(req.ice_pack_test_pct, 'ipt');
  ensureNum(req.fvc_pct, 'fvc');
  ensureStr(req.treatment, 'tx');
  ensureStr(req.thymectomy_status, 'ts');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function als_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.als_fvc_pct, 'afv');
  ensureNum(req.als_fvc_trend, 'aft');
  ensureNum(req.alsfrs_score, 'als');
  ensureNum(req.bulbar_score, 'bs');
  ensureBool(req.riluzole_started, 'rs');
  ensureBool(req.edaravone_started, 'es');
  ensureBool(req.non_invasive_ventilation, 'niv');
  ensureBool(req.g_tube_placed, 'gtp');
  ensureEnum(req.prognosis, 'prog', ['slow','moderate','rapid','unknown','other','late_stage']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function gbs_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.gbs_areflexia, 'ga');
  ensureEnum(req.gbs_nerve_conduction, 'gnc', ['demyelinating','axonal','mixed','normal','unknown','other']);
  ensureBool(req.albuminocytologic_dissociation, 'acd');
  ensureEnum(req.gbs_variant, 'gv', ['aidp','amam','amsan','miller_fisher','bickerstaff','pure_sensory','other','unknown']);
  ensureBool(req.ivig_started, 'is');
  ensureBool(req.plasmapheresis_done, 'pd');
  ensureNum(req.mrc_sum_score, 'mss');
  ensureBool(req.respiratory_failure_risk, 'rfr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function cnm_referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.clinical_question, 'cq');
  ensureEnum(req.exam_type, 'et', ['comprehensive','targeted','followup','second_opinion','other','initial']);
  ensureStr(req.diagnosis, 'dx');
  ensureBool(req.emg_requested, 'er');
  ensureBool(req.mri_requested, 'mr');
  ensureBool(req.genetic_test_requested, 'gtr');
  ensureEnum(req.special_findings, 'sf', ['normal','sensorimotor','pure_motor','pure_sensory','autonomic','mixed','unknown','other']);
  ensureStr(req.consult_specialty, 'cs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { neuropathy_workup, myasthenia_gravis, als_management, gbs_assessment, cnm_referral }; }
module.exports = { funcs, ValidationError };