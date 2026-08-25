// filepath: tier173_int_809_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gi_bleed(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.source, 'so', ['peptic','variceal','angiodysplasia','tumor','other','NA']);
  ensureNum(req.hgb, 'hg'); ensureBool(req.melena, 'me');
  ensureBool(req.hematemesis, 'he'); ensureEnum(req.hemodynamics, 'hd', ['stable','unstable','shock','NA']);
  ensureNum(req.transfusion_units, 'tu'); ensureEnum(req.scope, 'sc', ['urgent','emergent','elective','NA']);
  ensureEnum(req.intervention, 'in', ['none','epinephrine','clip','band','NA']);
  ensureStr(req.provider, 'pr');
  return { gb_id: `gb_${Date.now()}`, patient_id: req.patient_id, src: req.source, sc: req.scope };
}

function ibd_flare(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['UC','Crohns','indeterminate','NA']);
  ensureNum(req.score_mayo, 'sm'); ensureNum(req.calprotectin, 'cp');
  ensureNum(req.crp, 'cr'); ensureEnum(req.treatment, 'tr', ['5ASA','steroid','immunomodulator','biologic','NA']);
  ensureBool(req.iv_steroid, 'iv'); ensureEnum(req.response, 're', ['good','partial','poor','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { if_id: `if_${Date.now()}`, patient_id: req.patient_id, type: req.type, tr: req.treatment };
}

function liver_cirrhosis(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.meld_score, 'ms');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','NA']);
  ensureEnum(req.varices_grade, 'vg', ['none','I','II','III','NA']);
  ensureNum(req.ascites_grade, 'ag'); ensureNum(req.hepatic_encephalopathy, 'he');
  ensureEnum(req.treatment, 'tr', ['observation','beta_blocker','band_ligation','TIPS','transplant','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { lc_id: `lc_${Date.now()}`, patient_id: req.patient_id, meld: req.meld_score, cp: req.child_pugh };
}

function transplant_eval(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.organ, 'og', ['kidney','liver','heart','lung','pancreas','NA']);
  ensureNum(req.meld_score, 'ms'); ensureEnum(req.status, 'st', ['active','pending','listed','NA']);
  ensureNum(req.antibodies, 'ab'); ensureEnum(req.crossmatch, 'cm', ['negative','positive','pending','NA']);
  ensureEnum(req.donor_type, 'dt', ['living','deceased','paired','NA']);
  ensureNum(req.listing_date, 'ld'); ensureStr(req.provider, 'pr');
  return { te_id: `te_${Date.now()}`, patient_id: req.patient_id, og: req.organ, st: req.status };
}

function endoscopy_followup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['EGD','colonoscopy','ERCP','flex_sig','NA']);
  ensureEnum(req.indication, 'in', ['GERD','bleed','anemia','IBD','screening','NA']);
  ensureEnum(req.findings, 'fi', ['normal','inflammation','ulcer','polyp','mass','NA']);
  ensureNum(req.biopsies_count, 'bc'); ensureEnum(req.pathology, 'pa', ['normal','benign','malignant','NA']);
  ensureEnum(req.recommendation, 're', ['continue','follow_up','surgery','refer','NA']);
  ensureNum(req.next_interval_months, 'ni'); ensureStr(req.provider, 'pr');
  return { ef_id: `ef_${Date.now()}`, patient_id: req.patient_id, type: req.type, fi: req.findings };
}

function funcs() { return { gi_bleed, ibd_flare, liver_cirrhosis, transplant_eval, endoscopy_followup }; }
module.exports = { funcs, ValidationError };