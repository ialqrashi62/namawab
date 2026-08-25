// filepath: tier134_onc_684_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemo_order(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.regimen, 'rg');
  ensureEnum(req.cycle, 'cy', ['C1','C2','C3','C4','C5','C6','C7','C8','maintenance']);
  ensureNum(req.dose_mg_m2, 'ds');
  ensureEnum(req.route, 'rt', ['IV','PO','IM','SC','IT','IP']);
  ensureStr(req.provider, 'pr');
  return { order_id: `chemo_${Date.now()}`, patient_id: req.patient_id, regimen: req.regimen, cycle: req.cycle, dose: req.dose_mg_m2, route: req.route };
}
function radiation_session(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.treatment_site, 'ts');
  ensureNum(req.dose_gy, 'dg');
  ensureNum(req.fractions, 'fr');
  ensureEnum(req.modality, 'md', ['EBRT','IMRT','SBRT','SRS','brachy','proton']);
  ensureStr(req.provider, 'pr');
  return { tx_id: `rad_${Date.now()}`, patient_id: req.patient_id, site: req.treatment_site, dose_gy: req.dose_gy, fractions: req.fractions, modality: req.modality };
}
function tumor_board(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.diagnosis, 'dx');
  ensureEnum(req.stage, 'st', ['0','I','II','III','IV','NA']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.attendees, 'att');
  return { board_id: `tb_${Date.now()}`, patient_id: req.patient_id, diagnosis: req.diagnosis, stage: req.stage, recommendation: req.recommendation };
}
function survivorship(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.years_since_dx, 'ys');
  ensureStr(req.qol_score, 'qs');
  ensureStr(req.late_effects, 'le');
  ensureStr(req.followup_plan, 'fp');
  return { survivorship_id: `surv_${Date.now()}`, patient_id: req.patient_id, years_since_dx: req.years_since_dx, qol: req.qol_score, late_effects: req.late_effects };
}
function palliative_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.performance_status, 'ec', ['0','1','2','3','4']);
  ensureStr(req.goals, 'gl');
  ensureStr(req.symptom_burden, 'sb');
  return { consult_id: `pal_${Date.now()}`, patient_id: req.patient_id, pain: req.pain_score, ecog: req.performance_status, goals: req.goals };
}

function funcs() { return { chemo_order, radiation_session, tumor_board, survivorship, palliative_care }; }
module.exports = { funcs, ValidationError };
