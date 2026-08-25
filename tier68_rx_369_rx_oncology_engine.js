// filepath: tier68_rx_369_rx_oncology_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemo_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.protocol_name, 'pn');
  ensureNum(req.cycle, 'cy');
  ensureNum(req.day_of_cycle, 'doc');
  ensureNum(req.dose_modifications, 'dm');
  ensureStr(req.supportive_meds, 'sm');
  ensureBool(req.allergy_reviewed, 'ar');
  ensureBool(req.pharmacist_verified, 'pv');
  ensureStr(req.signed_by, 'sb');
  ensureStr(req.intended_date, 'id');
  return { protocol: req.protocol_name };
}
function chemo_pre_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.vitals_gradable, 'vg');
  ensureBool(req.labs_acceptable, 'la');
  ensureBool(req.pre_meds_given, 'pmg');
  ensureEnum(req.patient_consent, 'pc', ['verbal','written','electronic','implied','witness_signed','not_obtained','patient_refused','patient_incapacitated','other']);
  ensureBool(req.consent_documented, 'cd');
  ensureEnum(req.pre_administration_check, 'pac', ['all_pass','issues_resolved','deferred','patient_refused','labs_stale','vitals_off','provider_review','all_pass_with_minor','other']);
  ensureBool(req.nurse_verified, 'nv');
  ensureBool(req.time_verified, 'tv');
  return { check: req.pre_administration_check };
}
function chemo_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.infusion_start, 'is');
  ensureStr(req.infusion_end, 'ie');
  ensureNum(req.infusion_duration_min, 'idm');
  ensureNum(req.rate_ml_hr, 'rmh');
  ensureEnum(req.pre_meds_response, 'pmr', ['no_reaction','mild_rxn','moderate_rxn','severe_rxn','unknown','not_required','n_a']);
  ensureBool(req.observed_reaction, 'or');
  ensureNum(req.dose_administered_pct, 'dap');
  ensureStr(req.documented_by, 'db');
  ensureBool(req.iv_site_good, 'isg');
  return { start: req.infusion_start };
}
function chemo_toxicity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.toxicity_type, 'tt', ['neutropenia','febrile_neutropenia','thrombocytopenia','anemia','nephrotoxicity','neuropathy','mucositis','diarrhea','nausea_vomiting','hand_foot_syndrome','cardiotoxicity','ototoxicity','hypersensitivity','other']);
  ensureNum(req.grade, 'gr');
  ensureNum(req.ctcae_version, 'cv');
  ensureNum(req.onset_day, 'od');
  ensureEnum(req.intervention, 'int', ['neulasta','dose_reduction','delay_next_cycle','discontinue','hold','supportive_care','antibiotics','transfusion','hydration','antiemetics','hospitalization','other']);
  ensureBool(req.delay_next_cycle, 'dnc');
  ensureStr(req.next_cycle_date, 'ncd');
  ensureEnum(req.severity_assessment, 'sa', ['mild','moderate','severe','life_threatening','fatal','not_applicable','ambulatory','hospitalized']);
  ensureStr(req.managed_by, 'mb');
  return { toxicity: req.toxicity_type };
}
function chemo_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.days_post_cycle, 'dpc');
  ensureEnum(req.tolerance, 'tol', ['excellent','good','fair','poor','unacceptable','not_applicable','never_concerning','unknown']);
  ensureNum(req.fatigue_grade, 'fg');
  ensureNum(req.nausea_grade, 'ng');
  ensureNum(req.diarrhea_grade, 'dig');
  ensureNum(req.weight_change_kg, 'wcg');
  ensureEnum(req.hydration_status, 'hs', ['normal','mild_dehydration','moderate_dehydration','severe_dehydration','overhydration','not_applicable','unknown']);
  ensureBool(req.next_cycle_appropriate, 'nca');
  ensureStr(req.next_cycle_date, 'ncd');
  return { tolerance: req.tolerance };
}

function funcs() { return { chemo_order, chemo_pre_administration, chemo_administration, chemo_toxicity, chemo_followup }; }
module.exports = { funcs, ValidationError };