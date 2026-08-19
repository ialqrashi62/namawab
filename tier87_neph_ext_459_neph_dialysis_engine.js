// filepath: tier87_neph_ext_459_neph_dialysis_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hemodialysis_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.access_type, 'at', ['av_fistula','av_graft','catheter','unknown','other']);
  ensureNum(req.age_dialysis_initiation, 'adi');
  ensureStr(req.comorbidities, 'com');
  ensureEnum(req.initial_dialysis_adequacy, 'ida', ['adequate','inadequate','pending','unknown','other']);
  ensureNum(req.initial_kt_v, 'iktv');
  ensureNum(req.target_dry_weight, 'tdw');
  ensureNum(req.bp_pre_dialysis, 'bpd');
  ensureNum(req.hospitalization_count, 'hsc');
  ensureBool(req.transplant_evaluation, 'tre');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function hemodialysis_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.kt_v, 'ktv');
  ensureNum(req.uv_reabs, 'uvr');
  ensureNum(req.fluid_removed_kg, 'frm');
  ensureNum(req.bp_pre, 'bpp');
  ensureNum(req.bp_post, 'bpos');
  ensureNum(req.dry_weight_current, 'dwc');
  ensureNum(req.weight_post_dialysis, 'wpd');
  ensureEnum(req.disposition, 'disp', ['improving','stable','worsening','hospitalized','discontinued','died','unknown','other']);
  ensureNum(req.dialysis_vintage_years, 'dvy');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function dialysis_adequacy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.kt_v, 'ktv');
  ensureNum(req.urr, 'urr');
  ensureNum(req.urea_reduction_ratio, 'urr2');
  ensureNum(req.normalized_protein_nitrogen_appearance, 'npna');
  ensureNum(req.total_creatinine_output, 'tco');
  ensureNum(req.albumin, 'alb');
  ensureNum(req.dialysis_frequency, 'df');
  ensureBool(req.adequate_per_kdoqi, 'apk');
  ensureNum(req.dialysis_vintage_years, 'dvy');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function electrolyte_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphorus, 'ph');
  ensureNum(req.bicarbonate, 'bic');
  ensureNum(req.magnesium, 'mg');
  ensureNum(req.pth, 'pth');
  ensureNum(req.corrected_calcium, 'cca');
  ensureEnum(req.dietary_compliance, 'dc', ['good','partial','poor','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function dry_weight(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.current_dry_weight, 'cdw');
  ensureEnum(req.clinical_assessment, 'ca', ['edema_free','trace_edema','moderate_edema','severe_edema','cramping','hypotensive','unknown','other']);
  ensureNum(req.ibw_goal, 'ibw');
  ensureNum(req.previous_dry_weight, 'pdw');
  ensureNum(req.bp_with_dw, 'bpd');
  ensureNum(req.cramping_episodes, 'ce');
  ensureNum(req.intradialytic_weight_gain, 'iwg');
  ensureEnum(req.symptoms_following_dw, 'sfd', ['none','mild','moderate','severe','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { hemodialysis_initial, hemodialysis_followup, dialysis_adequacy, electrolyte_management, dry_weight }; }
module.exports = { funcs, ValidationError };