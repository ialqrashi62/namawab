// filepath: tier18_infx_ext_126_employee_engine.js
// TIER18_INFX_EXT-126: Employee health (vaccination, exposures, fit-test)
'use strict';

const CITATIONS = ['CDC_HEP_B_2024','CDC_FLU_2024','OSHA_BBP_2024','OSHA_RESPIRATOR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function employee_vaccination(req) {
  ensureStr(req.employee_id, 'employee_id');
  ensureEnum(req.vaccine_type, 'vaccine_type', ['covid','flu','hepb','mmr','varicella','tdap','hpv','meningococcal','japanese_encephalitis','rabies','yellow_fever','other']);
  ensureEnum(req.status, 'status', ['current','due','overdue','declined','medical_exemption','religious_exemption','unknown','other']);
  ensureNumber(req.doses_received, 'doses_received');
  ensureNumber(req.doses_required, 'doses_required');
  ensureEnum(req.decline_documented, 'decline_documented', ['yes_documented','no_undocumented','verbal_only','not_provided','n_a_current','other']);
  ensureBool(req.titer_proof, 'titer_proof');

  let status;
  if (req.status === 'overdue') status = 'overdue_exclusion_or_decline';
  else if (req.doses_received < req.doses_required && req.status === 'current') status = 'current_but_incomplete_doses';
  else if (req.status === 'declined' && req.decline_documented === 'no_undocumented') status = 'declined_no_annual_form_blocking';
  else if (req.titer_proof && req.doses_received === 0) status = 'titer_proof_only_documented_immunity';
  else status = 'vaccination_documented';
  return { status, vaccine: req.vaccine_type };
}

function employee_exposure(req) {
  ensureStr(req.exposure_id, 'exposure_id');
  ensureEnum(req.exposure_type, 'exposure_type', ['bbv_needlestick','bbv_splash','tb_respiratory','measles_airborne','varicella_airborne','meningococcal_droplet','c_diff_contact','other']);
  ensureEnum(req.fluid_type, 'fluid_type', ['blood','needle','sharps','body_fluid','respiratory','airborne','none','other']);
  ensureBool(req.source_known, 'source_known');
  ensureEnum(req.source_status, 'source_status', ['unknown','hbsag_negative','hbsag_positive','hcv_positive','hiv_positive','tb_active','varicella_infectious','other']);
  ensureNumber(req.time_to_report_min, 'time_to_report_min');
  ensureBool(req.baseline_labs_done, 'baseline_labs');

  let status;
  if (req.exposure_type === 'bbv_needlestick' && req.time_to_report_min > 60) status = 'needle_stick_over_60min_late_review';
  else if (req.source_status === 'hiv_positive' && !req.baseline_labs_done) status = 'hiv_exposure_baseline_labs_required_immediately';
  else if (req.exposure_type === 'tb_respiratory' && req.source_status === 'tb_active') status = 'tb_exposure_baseline_ppd_or_igra_required';
  else if (req.exposure_type === 'meningococcal_droplet') status = 'meningococcal_prophylaxis_offered_within_24h';
  else if (req.time_to_report_min > 1440) status = 'over_24h_late_post_exposure_care';
  else status = 'exposure_documented_appropriate';
  return { status, type: req.exposure_type };
}

function employee_fittest(req) {
  ensureStr(req.employee_id, 'employee_id');
  ensureEnum(req.respirator_type, 'respirator_type', ['n95','ffp2','ffp3','elastomeric_half','elastomeric_full','papr','powered','none','other']);
  ensureEnum(req.fit_test_result, 'fit_test_result', ['pass','fail','qualitative_pass','quantitative_pass','not_done','pending','expired','other']);
  ensureNumber(req.last_fit_test_days, 'last_fit_test_days');
  ensureEnum(req.size, 'size', ['small','medium','large','xl','xxl','petite','custom','not_assigned','other']);
  ensureBool(req.osha_1910_134_compliant, 'osha_compliant');

  let status;
  if (req.fit_test_result === 'fail') status = 'fit_test_fail_alternative_required';
  else if (req.last_fit_test_days > 365) status = 'annual_fit_test_overdue';
  else if (req.fit_test_result === 'not_done' && req.respirator_type !== 'none') status = 'fit_test_required_for_respirator';
  else if (!req.osha_1910_134_compliant) status = 'osha_compliance_required';
  else status = 'fit_test_current';
  return { status, respirator: req.respirator_type };
}

function employee_illness_exclusion(req) {
  ensureStr(req.employee_id, 'employee_id');
  ensureEnum(req.symptom, 'symptom', ['fever','cough','runny_nose','sore_throat','rash','vomiting','diarrhea','conjunctivitis','jaundice','lesions','exposure_only','asymptomatic','other']);
  ensureEnum(req.diagnosis, 'diagnosis', ['none','covid','influenza','measles','varicella','pertussis','mumps','tb','hepatitis_a','staph_skin','conjun','gastro','other']);
  ensureBool(req.direct_patient_care, 'direct_care');
  ensureNumber(req.days_symptomatic, 'days_symptomatic');
  ensureEnum(req.clearance_status, 'clearance_status', ['cleared_to_work','excluded','cleared_with_restrictions','under_review','self_excluded','other']);
  ensureBool(req.fever_free_24h, 'fever_free_24h');

  let status;
  if (req.direct_patient_care && req.clearance_status === 'excluded') status = 'excluded_from_work_required';
  else if (req.diagnosis === 'tb' && req.direct_patient_care && req.clearance_status !== 'excluded') status = 'tb_active_direct_care_excluded';
  else if (req.diagnosis === 'influenza' && req.direct_patient_care && !req.fever_free_24h) status = 'flu_fever_free_required_24h';
  else if (req.diagnosis === 'gastro' && req.direct_patient_care && req.clearance_status !== 'excluded') status = 'gastro_diarrhea_exclude_48h';
  else status = 'clearance_appropriate';
  return { status, status_name: req.clearance_status };
}

function employee_tb_screen(req) {
  ensureStr(req.employee_id, 'employee_id');
  ensureEnum(req.test_type, 'test_type', ['ppd_tst','igra_tspot','igra_quantiferon','both','none','other']);
  ensureEnum(req.result, 'result', ['negative','positive','indeterminate','borderline','pending','invalid','other']);
  ensureNumber(req.induration_mm, 'induration_mm');
  ensureBool(req.baseline_done, 'baseline_done');
  ensureBool(req.annual_done, 'annual_done');
  ensureBool(req.symptoms_now, 'symptoms_now');
  ensureEnum(req.exposure_history, 'exposure_history', ['none','household','occupational','community','unknown','other']);

  let status;
  if (req.symptoms_now) status = 'symptoms_active_evaluate_active_tb_immediately';
  else if (req.result === 'positive') status = 'positive_convert_to_chest_xray_and_documented';
  else if (req.result === 'indeterminate') status = 'indeterminate_repeat_test';
  else if (!req.baseline_done) status = 'baseline_required_at_hire';
  else if (req.exposure_history === 'occupational' && !req.annual_done) status = 'occupational_exposure_annual_required';
  else status = 'tb_screen_documented';
  return { status, result: req.result };
}

function funcs() { return { employee_vaccination, employee_exposure, employee_fittest, employee_illness_exclusion, employee_tb_screen }; }
module.exports = { funcs, CITATIONS, ValidationError };