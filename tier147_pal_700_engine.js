// filepath: tier147_pal_700_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pps_pct, 'pp');
  ensureEnum(req.disease_stage, 'ds', ['curable','chronic','advanced','end_stage','terminal','unknown']);
  ensureNum(req.prognosis_months, 'pg');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.goals, 'go', ['cure','prolong_life','improve_function','symptom_control','comfort','dying_at_home','dying_in_hospital','hospice','other']);
  ensureBool(req.advance_directive, 'ad');
  ensureStr(req.code_status, 'cs');
  ensureStr(req.provider, 'pr');
  return { cn_id: `pcs_${Date.now()}`, patient_id: req.patient_id, pps: req.pps_pct, stage: req.disease_stage };
}
function pain(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['nociceptive_somatic','nociceptive_visceral','neuropathic','mixed','breakthrough','incident','incident_volitional','incident_non_volitional','other']);
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.morphine_equiv_mg_day, 'me');
  ensureEnum(req.route, 'rt', ['PO','SL','SC','IV','IM','PR','TD','IT','epidural','other']);
  ensureBool(req.adverse_effects, 'ae');
  ensureNum(req.laxative, 'lx');
  ensureNum(req.antiemetic, 'ae2');
  ensureStr(req.provider, 'pr');
  return { pn_id: `plp_${Date.now()}`, patient_id: req.patient_id, type: req.type, me: req.morphine_equiv_mg_day };
}
function symptom(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.symptom, 'sy', ['dyspnea','cough','nausea','vomiting','constipation','delirium','agitation','anxiety','depression','insomnia','fatigue','anorexia','cachexia','edema','ascites','hiccups','pruritus','xerostomia','other']);
  ensureNum(req.severity, 'sv');
  ensureEnum(req.treatment, 'tr', ['none','pharmacologic','non_pharmacologic','both','other']);
  ensureNum(req.response_pct, 'rp');
  ensureBool(req.family_meeting, 'fm');
  ensureStr(req.notes, 'nt');
  ensureStr(req.provider, 'pr');
  return { sy_id: `psy_${Date.now()}`, patient_id: req.patient_id, symptom: req.symptom, severity: req.severity };
}
function goals_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.code_status, 'cs', ['full_code','DNR','DNI','DNR_DNI','comfort_only','other']);
  ensureBool(req.advance_directive, 'ad');
  ensureBool(req.healthcare_proxy, 'hp');
  ensureBool(req.polst, 'po');
  ensureNum(req.meeting_count, 'mc');
  ensureEnum(req.decision_maker, 'dm', ['patient','spouse','parent','child','sibling','proxy','court','other']);
  ensureStr(req.values, 'vl');
  ensureStr(req.provider, 'pr');
  return { gc_id: `goc_${Date.now()}`, patient_id: req.patient_id, code: req.code_status, dm: req.decision_maker };
}
function hospice(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.level, 'lv', ['routine_home','continuous_home','general_inpatient','respite','unknown','NA']);
  ensureBool(req.eligible, 'el');
  ensureEnum(req.referral, 'rf', ['family','patient','hospital','PCP','specialist','self','other']);
  ensureNum(req.days_enrolled, 'de');
  ensureBool(req.death_at_home, 'dh');
  ensureStr(req.family_burden, 'fb');
  ensureStr(req.provider, 'pr');
  return { hs_id: `hsp_${Date.now()}`, patient_id: req.patient_id, level: req.level, eligible: req.eligible };
}

function funcs() { return { consult, pain, symptom, goals_care, hospice }; }
module.exports = { funcs, ValidationError };