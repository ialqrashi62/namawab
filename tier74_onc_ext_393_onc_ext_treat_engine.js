// filepath: tier74_onc_ext_393_onc_ext_treat_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemo_regimen_select(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cancer_type, 'ct', ['breast_ca','lung_ca','colon_ca','pancreatic','prostate_ca','ovarian','lymphoma','leukemia','multiple_myeloma','kidney','bladder','liver','cervical','esophageal','gastric','head_neck','sarcoma','melanoma','brain','other']);
  ensureStr(req.stage, 'stage');
  ensureStr(req.receptor_status, 'rs');
  ensureStr(req.comorbidities, 'com');
  ensureEnum(req.treatment_goal, 'tg', ['curative','palliative','neoadjuvant','adjuvant','maintenance','watchful_waiting','other']);
  ensureStr(req.regimen_recommended, 'rr');
  ensureBool(req.consent_obtained, 'co');
  ensureEnum(req.regimen_level_of_evidence, 'loe', ['high','moderate','low','very_low','expert_opinion','guideline','consensus','other']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.second_opinion_offered, 'soo');
  return { cancer: req.cancer_type };
}
function targeted_therapy_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'target');
  ensureStr(req.agent, 'ag');
  ensureNum(req.dose_mg_per_kg, 'dmk');
  ensureEnum(req.frequency, 'freq', ['q1w','q2w','biweekly','q3w','q4w','weekly','monthly','q6w','q8w','other']);
  ensureNum(req.cycle, 'cy');
  ensureStr(req.biomarker_confirmed, 'bc');
  ensureBool(req.biosafety_required, 'br');
  ensureStr(req.pre_meds, 'pm');
  ensureStr(req.imaging_for_response, 'ifr');
  ensureStr(req.provider, 'pr');
  ensureBool(req.consent_obtained, 'co');
  return { agent: req.agent };
}
function immunotherapy_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.agent, 'ag');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.frequency, 'freq', ['q1w','q2w','biweekly','q3w','q4w','weekly','monthly','q6w','q8w','other']);
  ensureNum(req.cycle, 'cy');
  ensureStr(req.indication, 'ind');
  ensureStr(req.biomarker, 'bm');
  ensureBool(req.pre_meds_required, 'pmr');
  ensureBool(req.immune_related_pe_counseled, 'irpc');
  ensureStr(req.response_assessment, 'ra');
  ensureStr(req.provider, 'pr');
  ensureBool(req.consent_obtained, 'co');
  return { agent: req.agent };
}
function hormone_therapy_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cancer_type, 'ct', ['prostate_ca','breast_ca','endometrial','ovarian','thyroid','kidney','other']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.agent, 'ag');
  ensureNum(req.dose_mg, 'dm');
  ensureStr(req.frequency, 'freq');
  ensureStr(req.combination, 'comb');
  ensureStr(req.response_marker, 'rm');
  ensureBool(req.side_effects_counseled, 'sec');
  ensureBool(req.consent_obtained, 'co');
  ensureStr(req.provider, 'pr');
  ensureStr(req.bone_health_plan, 'bhp');
  return { agent: req.agent };
}
function radiation_oncology_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureStr(req.modality, 'mod');
  ensureNum(req.total_dose_gy, 'tdg');
  ensureNum(req.fractions, 'frac');
  ensureStr(req.technique, 'tech');
  ensureBool(req.fiducials_placed, 'fp');
  ensureBool(req.image_guided, 'ig');
  ensureStr(req.plan_reviewed_by, 'prb');
  ensureStr(req.provider, 'pr');
  ensureBool(req.consent_obtained, 'co');
  ensureBool(req.pre_treatment_sim_done, 'ptsd');
  return { site: req.site };
}

function funcs() { return { chemo_regimen_select, targeted_therapy_order, immunotherapy_order, hormone_therapy_order, radiation_oncology_order }; }
module.exports = { funcs, ValidationError };