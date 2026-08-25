// filepath: tier162_prev_760_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function immunization(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.vaccine, 'vc', ['influenza','covid','tdap','hpv','pneumococcal','shingles','hepB','MMR','varicella','other','NA']);
  ensureNum(req.dose_number, 'dn'); ensureNum(req.doses_total, 'dt');
  ensureEnum(req.administration_site, 'as', ['IM_left_deltoid','IM_right_deltoid','IM_thigh','SC','intranasal','oral','other','NA']);
  ensureNum(req.lot_number, 'ln'); ensureNum(req.expiration_date, 'ex');
  ensureBool(req.contraindication, 'ci'); ensureNum(req.observation_min, 'ob');
  ensureBool(req.ae, 'ae'); ensureStr(req.provider, 'pr');
  return { im_id: `im_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine, dose: req.dose_number };
}

function chemoprevention(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.indication, 'in', ['cad','cancer_prev','osteoporosis','dvt','malaria','HIV','other','NA']);
  ensureEnum(req.agent, 'ag', ['aspirin','statin','metformin','tamoxifen','raloxifene','finasteride','hydroxyurea','TDF','other','NA']);
  ensureNum(req.dose, 'ds'); ensureNum(req.duration_months, 'du');
  ensureBool(req.contraindication, 'ci'); ensureEnum(req.outcome, 'ot', ['reduced_incidence','no_change','reduced_mortality','adverse_event','NA']);
  ensureNum(req.adherence_pct, 'ad'); ensureNum(req.benefit_score, 'bs');
  ensureStr(req.provider, 'pr');
  return { cp_id: `cp_${Date.now()}`, patient_id: req.patient_id, agent: req.agent, indication: req.indication };
}

function lifestyle_counsel(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bmi, 'bm');
  ensureEnum(req.topic, 'tc', ['diet','exercise','smoking','alcohol','sleep','stress','combination','NA']);
  ensureNum(req.sessions, 'sn'); ensureNum(req.minutes_per_session, 'mp');
  ensureEnum(req.method, 'mt', ['in_person','phone','video','app','group','printed','NA']);
  ensureNum(req.readiness_score, 'rs'); ensureEnum(req.stage, 'st', ['precontemplation','contemplation','preparation','action','maintenance','NA']);
  ensureNum(req.weight_change_kg, 'wc'); ensureNum(req.activity_change_min_week, 'ac');
  ensureStr(req.provider, 'pr');
  return { lc_id: `lc_${Date.now()}`, patient_id: req.patient_id, topic: req.topic, sessions: req.sessions };
}

function screening_prog(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.program, 'pr', ['breast','cervical','colorectal','lung','prostate','AAA','diabetes','osteoporosis','NA']);
  ensureNum(req.eligible_count, 'ec'); ensureNum(req.screened_count, 'sc');
  ensureNum(req.up_to_date_pct, 'ud'); ensureNum(req.positive_count, 'pc');
  ensureEnum(req.recall, 'rc', ['mailed','phone','EMR','none','NA']);
  ensureNum(req.days_since_last, 'dl'); ensureEnum(req.disposition, 'di', ['continue','diagnostic','biopsy','treatment','NA']);
  ensureStr(req.provider, 'pr');
  return { sp_id: `sp_${Date.now()}`, patient_id: req.patient_id, program: req.program, up_to_date_pct: req.up_to_date_pct };
}

function risk_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureBool(req.smoker, 'sm');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.ldl, 'ld');
  ensureNum(req.hba1c, 'h1'); ensureNum(req.bmi, 'bm');
  ensureNum(req.framingham_10yr, 'fg'); ensureNum(req.acc_aha_10yr, 'ac');
  ensureNum(req.cv_risk_factors, 'cv'); ensureEnum(req.risk_category, 'rc', ['low','borderline','intermediate','high','very_high','NA']);
  ensureBool(req.treatment_initiated, 'ti'); ensureEnum(req.intervention, 'iv', ['lifestyle','statin','aspirin','combination','none','NA']);
  ensureStr(req.provider, 'pr');
  return { ra_id: `ra_${Date.now()}`, patient_id: req.patient_id, risk: req.risk_category, framingham: req.framingham_10yr };
}

function funcs() { return { immunization, chemoprevention, lifestyle_counsel, screening_prog, risk_assessment }; }
module.exports = { funcs, ValidationError };