// filepath: tier64_pop_health_349_pop_screen_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cancer_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.screening_type, 'st', ['mammography','colonoscopy','fit_fobt','pap_smear','hpv_test','lung_ldct','prostate_psa','skin_exam','cervical_co_test']);
  ensureStr(req.due_date, 'dd');
  ensureBool(req.overdue, 'od');
  ensureStr(req.last_completed, 'lc');
  ensureStr(req.results, 'res');
  ensureStr(req.follow_up_plan, 'fup');
  return { type: req.screening_type };
}
function preventive_care_gaps(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gaps_identified, 'gi');
  ensureEnum(req.priority, 'pri', ['low','moderate','high','critical']);
  ensureNum(req.gap_count, 'gc');
  ensureBool(req.pcp_assigned, 'pa');
  ensureStr(req.closing_plan, 'cp');
  return { gaps: req.gaps_identified };
}
function immunization_gaps(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.missing_vaccines, 'mv');
  ensureStr(req.contraindications, 'ci');
  ensureStr(req.recommendation, 'rec');
  ensureEnum(req.priority, 'pri', ['low','moderate','high','critical']);
  ensureStr(req.due_date, 'dd');
  return { missing: req.missing_vaccines };
}
function wellness_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.visit_type, 'vt', ['annual_wellness','initial_preventive','sports_physical','well_child','medicare_awv','medicare_ippe']);
  ensureStr(req.scheduled, 'sched');
  ensureBool(req.completed, 'comp');
  ensureStr(req.preventive_items, 'pi');
  ensureBool(req.awv_billed, 'ab');
  ensureStr(req.awv_code, 'ac');
  return { type: req.visit_type };
}
function social_determinants(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.food_insecurity, 'fi');
  ensureBool(req.housing_instability, 'hi');
  ensureBool(req.transportation_barrier, 'tb');
  ensureBool(req.financial_strain, 'fs');
  ensureStr(req.referral, 'ref');
  ensureEnum(req.language, 'lang', ['english','arabic','french','urdu','hindi','spanish','other']);
  return { lang: req.language };
}

function funcs() { return { cancer_screening, preventive_care_gaps, immunization_gaps, wellness_visit, social_determinants }; }
module.exports = { funcs, ValidationError };