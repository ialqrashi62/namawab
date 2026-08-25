// filepath: tier69_mh_377_mh_community_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function case_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureBool(req.housing_instability, 'hi');
  ensureBool(req.transportation_barrier, 'tb');
  ensureBool(req.food_insecurity, 'fi');
  ensureStr(req.coordination_needed, 'cn');
  ensureNum(req.referrals_active, 'ra');
  ensureStr(req.caseworker, 'cw');
  ensureEnum(req.contact_frequency, 'cf', ['daily','multiple_per_week','weekly','biweekly','monthly','quarterly','as_needed','on_demand','unscheduled','unknown']);
  ensureNum(req.progress_notes, 'pn');
  return { case_id: req.case_id };
}
function peer_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.peer_specialist, 'ps');
  ensureNum(req.engagement_count, 'ec');
  ensureStr(req.topics, 'topics');
  ensureStr(req.goal_progress, 'gp');
  ensureBool(req.mutual_support_offered, 'mso');
  ensureBool(req.referral_to_clinical, 'rtc');
  ensureNum(req.next_session, 'ns');
  ensureBool(req.documentation_complete, 'dc');
  return { ps: req.peer_specialist };
}
function community_resources_wraparound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.resources_connected, 'rc');
  ensureNum(req.hours_per_week, 'hpw');
  ensureBool(req.wraparound_plan_active, 'wpa');
  ensureBool(req.family_engaged, 'fe');
  ensureNum(req.annualized_savings, 'as');
  ensureStr(req.provider, 'pr');
  ensureNum(req.referrals_active, 'ra');
  ensureNum(req.completion_pct, 'cp');
  return { resources: req.resources_connected };
}
function supported_employment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.vocational_rehab, 'vr');
  ensureBool(req.job_search, 'js');
  ensureEnum(req.employment_status, 'es', ['unemployed','part_time','full_time','seasonal','contract','self_employed','supported','sheltered','competitive','transition','disabled','student','retired','homemaker','other']);
  ensureBool(req.employer_disclosure, 'ed');
  ensureStr(req.supported_employment_provider, 'sep');
  ensureNum(req.stipends_received, 'sr');
  ensureNum(req.engagement_score, 'es2');
  ensureNum(req.monitoring_period_months, 'mpm');
  return { es: req.employment_status };
}
function school_link(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.school_id, 'sid');
  ensureBool(req.iep_active, 'ia');
  ensureEnum(req.school_engagement, 'se', ['excellent','good','moderate','poor','unknown','exemplary','inadequate','trending_up','trending_down','stable']);
  ensureEnum(req.school_behavior, 'sb', ['excellent','good','appropriate','poor','inappropriate','disruptive','unknown','variable','improving','deteriorating']);
  ensureBool(req['504_active'], 'fa');
  ensureStr(req.collab_provider, 'cp');
  ensureEnum(req.family_school_engagement, 'fse', ['active','passive','limited','disengaged','unknown','collaborative','good','excellent','mediocre','strong']);
  ensureNum(req.next_review, 'nr');
  return { school: req.school_id };
}

function funcs() { return { case_management, peer_support, community_resources_wraparound, supported_employment, school_link }; }
module.exports = { funcs, ValidationError };