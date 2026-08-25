// filepath: tier88_gi_liver_466_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hepatitis_clinic_gi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.virus_type, 'vt', ['hbsag','hbeag','hbcab','hcv','hepatitis_a','hepatitis_e','dual_hbv_hcv','other','unknown']);
  ensureNum(req.al_t, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.hbv_dna, 'hbvd');
  ensureNum(req.hcv_rna, 'hcvr');
  ensureNum(req.bilirubin, 'bili');
  ensureNum(req.albumin, 'alb');
  ensureNum(req.inr, 'inr');
  ensureNum(req.fibroscan, 'fib');
  ensureEnum(req.treatment_status, 'ts', ['naive','on_treatment','completed','off_treatment','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function cirrhosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.meld_score, 'meld');
  ensureNum(req.child_pugh_score, 'cps');
  ensureBool(req.ascites_present, 'ap');
  ensureNum(req.encephalopathy_grade, 'eg');
  ensureBool(req.variceal_bleed_history, 'vbh');
  ensureBool(req.alcohol_cessation, 'ac');
  ensureBool(req.lactulose_started, 'ls');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function liver_mass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.lesion_count, 'lc');
  ensureNum(req.size_cm, 'sc');
  ensureEnum(req.mri_li_rads, 'mlr', ['lr_1','lr_2','lr_3','lr_4','lr_5','lr_m','unclear','other','unknown']);
  ensureNum(req.afp_level, 'afp');
  ensureBool(req.biopsy_done, 'bd');
  ensureNum(req.surveillance_period, 'sp');
  ensureEnum(req.risk_score, 'rs', ['low','intermediate','high','unknown','other']);
  ensureEnum(req.recommendation, 'rec', ['imaging_followup','biopsy','treat','referral','combination','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function liver_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.days_post_txp, 'dpt');
  ensureEnum(req.immunosuppression, 'is', ['tac_mmf','tac_aza','cyclosporine','sirolimus','everolimus','combination','other']);
  ensureEnum(req.graft_function, 'gf', ['normal','abnormal_lfts','rejection','graft_loss','unknown']);
  ensureNum(req.rejection_episodes, 're');
  ensureNum(req.infection_history, 'ih');
  ensureEnum(req.biliary_complications, 'bc', ['none','anastomotic_stricture','bile_leak','ischemic_cholangiopathy','other','unknown']);
  ensureEnum(req.liver_function, 'lf', ['normal','mild_abnormal','moderate_abnormal','severe_abnormal','unknown']);
  ensureBool(req.oncology_screened, 'os');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function portal_htn(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.hepatic_pressure_gradient_mmHg, 'hpg');
  ensureBool(req.varices_present, 'vp');
  ensureNum(req.variceal_grade, 'vg');
  ensureBool(req.bleeding_history, 'bh');
  ensureBool(req.nonselective_beta_blocker, 'nsbb');
  ensureNum(req.bands_done, 'bd');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureEnum(req.complications, 'comp', ['none','active_bleeding','rebleeding','spontaneous_bacterial_peritonitis','hepatorenal','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { hepatitis_clinic_gi, cirrhosis, liver_mass, liver_transplant, portal_htn }; }
module.exports = { funcs, ValidationError };