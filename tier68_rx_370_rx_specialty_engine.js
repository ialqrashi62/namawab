// filepath: tier68_rx_370_rx_specialty_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function biologic_order(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.biologic, 'bio');
  ensureStr(req.indication, 'ind');
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.frequency, 'freq', ['q1w','q2w','biweekly','q4w','monthly','q6w','q8w','q12w','loading_then_maintenance','one_time','every_2_weeks','every_4_weeks','every_8_weeks']);
  ensureEnum(req.site_recommendation, 'sr', ['abdomen','thigh','upper_arm','gluteus','sc_anywhere','iv_only','subcutaneous','iv_infusion','im','other']);
  ensureBool(req.tb_screening_done, 'tsd');
  ensureBool(req.hepatitis_b_panel, 'hbp');
  ensureBool(req.patient_consent, 'pc');
  ensureBool(req.prior_authorization_obtained, 'pao');
  return { biologic: req.biologic };
}
function biologic_infusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.infusion_id, 'iid');
  ensureStr(req.biologic, 'bio');
  ensureNum(req.dose_mg_per_kg, 'dmpk');
  ensureNum(req.weight_kg, 'wkg');
  ensureNum(req.total_dose_mg, 'tdm');
  ensureNum(req.infusion_duration_min, 'idm');
  ensureStr(req.pre_meds, 'pm');
  ensureEnum(req.reactions, 'rxn', ['none','mild_infusion_reaction','moderate_infusion_reaction','severe_infusion_reaction','anaphylaxis','hypersensitivity','delayed_reaction','unknown','nausea','flushing','other']);
  ensureNum(req.observation_period_min, 'opm');
  ensureStr(req.documented_by, 'db');
  return { bio: req.biologic };
}
function biologic_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.biologic, 'bio');
  ensureNum(req.month_on_therapy, 'mot');
  ensureEnum(req.clinical_response, 'cr', ['excellent','good','partial','minimal','no_response','intolerance','failure','ongoing','unknown']);
  ensureStr(req.labs_recent, 'lr');
  ensureEnum(req.antibody_test, 'at', ['negative','low_positive','moderate','high','not_tested','pending','inconclusive','other']);
  ensureEnum(req.complications, 'comp', ['none','infection','infusion_reaction','malignancy','liver','tb','other','pending']);
  ensureStr(req.next_infusion_due, 'nid');
  ensureEnum(req.response_grade, 'rg', ['excellent','good','moderate','partial','minimal','none','unknown','ongoing']);
  return { response: req.clinical_response };
}
function biologic_immunogenicity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.biologic, 'bio');
  ensureEnum(req.antibody_test, 'at', ['negative','positive','low_positive','moderate','high','not_tested','pending','inconclusive','other']);
  ensureEnum(req.antibody_titer, 'att', ['low','moderate','high','low_positive','high_positive','negative','pending','not_done']);
  ensureEnum(req.clinical_significance, 'cs', ['reduced_response','loss_of_response','no_significance','confirmed_block','delayed_hypersensitivity','immediate_hypersensitivity','tolerance','unknown']);
  ensureEnum(req.next_step, 'ns', ['continue','switch_biologic','switch_class','add_methotrexate','dose_escalate','monitor','hold','discontinue','refer_to_specialist','other']);
  ensureStr(req.alternative, 'alt');
  ensureStr(req.decision_made_by, 'dmb');
  ensureBool(req.documentation_complete, 'dc');
  return { bio: req.biologic };
}
function specialty_appeals(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.appeal_id, 'aid');
  ensureStr(req.specialty_med, 'sm');
  ensureStr(req.payer, 'payer');
  ensureEnum(req.reason, 'rsn', ['medical_necessity','non_formulary','step_therapy','quantity_limit','preauthorization_required','dose_above_limit','specialty_required','other','prior_authorization_required','not_preferred']);
  ensureBool(req.letter_attached, 'la');
  ensureBool(req.peer_to_peer_scheduled, 'p2ps');
  ensureNum(req.expected_response_days, 'erd');
  ensureEnum(req.appeal_status, 'as', ['drafted','submitted','under_review','approved','denied','peer_to_peer_held','peer_to_peer_required','peer_to_peer_approved','closed','escalated','other']);
  ensureNum(req.docs_submitted, 'ds');
  return { appeal: req.appeal_id };
}

function funcs() { return { biologic_order, biologic_infusion, biologic_monitoring, biologic_immunogenicity, specialty_appeals }; }
module.exports = { funcs, ValidationError };