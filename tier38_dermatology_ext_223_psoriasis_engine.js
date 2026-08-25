// filepath: tier38_dermatology_ext_223_psoriasis_engine.js
// TIER38_DERMATOLOGY-223: Psoriasis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function psoriasis_severity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.pasi_score, 'pasi');
  ensureNumber(req.bsa_pct, 'bsa');
  ensureNumber(req.dlqi, 'dlqi');
  ensureEnum(req.previous_systemic, 'prev', ['none','methotrexate','cyclosporine','apremilast','biologic','other']);
  ensureBool(req.biologic_naive, 'naive');
  let severity, status;
  if (req.pasi_score >= 12 || req.bsa_pct >= 10) {
    severity = req.pasi_score >= 20 ? 'severe' : 'moderate_to_severe';
    status = 'systemic_therapy_indicated';
  } else if (req.pasi_score >= 3) {
    severity = 'mild_to_moderate';
    status = 'topical_phototherapy_first_line';
  } else {
    severity = 'mild';
    status = 'topical_therapy_adequate';
  }
  if (req.dlqi >= 10 && req.severity !== 'severe') status = 'high_dlqi_reconsider_severity';
  return { status, sev: severity, pasi: req.pasi_score };
}

function topical_psoriasis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.topical, 'top', ['low_potency_steroid','mid_potency_steroid','high_potency_steroid','super_high_steroid','vitamin_d_analog','steroid_vitamin_d_combo','tar','anthralin','calcipotriol','none','other']);
  ensureEnum(req.frequency, 'freq', ['once_daily','twice_daily','three_times_week','weekly','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','partial','poor','none','unknown']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.sites, 'sites', ['scalp','extensor','inverse','palms_soles','nails','genital','face','multiple','other']);
  let status;
  if (req.duration_weeks > 12 && req.response === 'poor') status = 'topical_failure_escalate_systemic';
  else if (req.topical === 'super_high_steroid' && req.sites === 'face') status = 'face_steroid_caution_use_vitamin_d';
  else if (req.response === 'good' || req.response === 'excellent') status = 'topical_response_maintain';
  else status = 'topical_review';
  return { status, top: req.topical };
}

function systemic_psoriasis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.drug, 'drug', ['methotrexate','cyclosporine','apremilast','acitretin','none','other']);
  ensureNumber(req.dose_mg, 'dose');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  ensureNumber(req.lfts, 'lfts');
  ensureEnum(req.pregnancy_test, 'preg', ['positive','negative','not_applicable','pending','unknown']);
  ensureBool(req.monitoring_complete, 'mon');
  let status;
  if (req.lfts >= 100) status = 'methotrexate_hepatotoxicity_hold';
  else if (req.drug === 'methotrexate' && req.pregnancy_test === 'positive') status = 'mtx_pregnancy_contraindicated';
  else if (req.monitoring_complete === false) status = 'systemic_monitoring_required';
  else if (req.response === 'excellent' || req.response === 'good') status = 'systemic_response_maintain';
  else if (req.response === 'poor') status = 'systemic_failure_consider_biologic';
  else status = 'systemic_review';
  return { status, d: req.drug };
}

function biologic_psoriasis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.biologic, 'bio', ['adalimumab','etanercept','infliximab','ustekinumab','secukinumab','ixekizumab','guselkumab','risankizumab','tildrakizumab','brodalumab','none','other']);
  ensureNumber(req.duration_months, 'dur');
  ensureEnum(req.response, 'resp', ['clearance','minimal','moderate','partial','failed','unknown']);
  ensureBool(req.tb_screening, 'tb');
  ensureBool(req.infection_signs, 'inf');
  let status;
  if (req.infection_signs) status = 'infection_hold_biologic_evaluate';
  else if (req.tb_screening === false) status = 'tb_screening_required_biologic';
  else if (req.response === 'clearance') status = 'biologic_clearance_maintain';
  else if (req.response === 'failed' && req.duration_months >= 6) status = 'biologic_failure_switch';
  else status = 'biologic_review';
  return { status, b: req.biologic };
}

function psoriasis_arthritis_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.joint_pain, 'jp');
  ensureNumber(req.swollen_joints, 'sj');
  ensureNumber(req.pasi, 'pasi');
  ensureNumber(req.napsi, 'napsi');
  ensureBool(req.pase_positive, 'pase');
  ensureBool(req.refer_rheumatology, 'refer');
  let status;
  if (req.swollen_joints >= 3 && req.joint_pain) status = 'psoriatic_arthritis_urgent_rheum';
  else if (req.pase_positive && req.joint_pain && req.swollen_joints >= 1) status = 'psa_screen_positive_refer';
  else if (req.napsi >= 3) status = 'nail_psoriasis_high_arthritis_risk';
  else if (req.joint_pain && req.refer_rheumatology === false) status = 'joint_pain_screen_complete_refer';
  else status = 'psa_screen_review';
  return { status, sj: req.swollen_joints };
}

function funcs() { return { psoriasis_severity, topical_psoriasis, systemic_psoriasis, biologic_psoriasis, psoriasis_arthritis_screen }; }
module.exports = { funcs, ValidationError };