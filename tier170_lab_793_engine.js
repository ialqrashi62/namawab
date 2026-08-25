// filepath: tier170_lab_793_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hematology(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.wbc, 'wb'); ensureNum(req.hgb, 'hg');
  ensureNum(req.platelet, 'pl'); ensureNum(req.neut_pct, 'np');
  ensureNum(req.lymph_pct, 'lp'); ensureNum(req.anc, 'an');
  ensureEnum(req.flag, 'fl', ['normal','low','high','critical','NA']);
  ensureNum(req.specimen_age_min, 'sa'); ensureStr(req.provider, 'pr');
  return { hm_id: `hm_${Date.now()}`, patient_id: req.patient_id, hgb: req.hgb, wbc: req.wbc };
}

function chemistry(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.sodium, 'na'); ensureNum(req.potassium, 'ka');
  ensureNum(req.glucose, 'gl'); ensureNum(req.creatinine, 'cr');
  ensureNum(req.bun, 'bu'); ensureNum(req.troponin, 'tr');
  ensureNum(req.lactate, 'la'); ensureEnum(req.flag, 'fl', ['normal','low','high','critical','NA']);
  ensureStr(req.provider, 'pr');
  return { ch_id: `ch_${Date.now()}`, patient_id: req.patient_id, na: req.sodium, k: req.potassium };
}

function microbiology(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.specimen, 'sp'); ensureEnum(req.stain, 'st', ['none','gram_pos','gram_neg','mixed','NA']);
  ensureNum(req.organism_count, 'oc'); ensureStr(req.organism, 'og');
  ensureEnum(req.sensitivity, 'se', ['S','I','R','NA','pending']);
  ensureNum(req.hours_to_growth, 'hg'); ensureEnum(req.final, 'fi', ['pending','complete','contaminated','NA']);
  ensureStr(req.provider, 'pr');
  return { mb_id: `mb_${Date.now()}`, patient_id: req.patient_id, organism: req.organism, sens: req.sensitivity };
}

function transfusion(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.product, 'pr', ['PRBC','platelets','FFP','cryo','whole_blood','NA']);
  ensureNum(req.units, 'un'); ensureNum(req.pre_hgb, 'ph');
  ensureNum(req.post_hgb, 'po'); ensureNum(req.pre_plt, 'pp');
  ensureNum(req.post_plt, 'po2'); ensureBool(req.reaction, 're');
  ensureEnum(req.disposition, 'di', ['home','floor','ICU','OR','NA']);
  ensureStr(req.provider, 'pr');
  return { tr_id: `tr_${Date.now()}`, patient_id: req.patient_id, product: req.product, units: req.units };
}

function molecular_lab(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.test_type, 'tt', ['PCR','NGS','FISH','CISH','microarray','NA']);
  ensureStr(req.gene, 'ge'); ensureStr(req.variant, 'vr');
  ensureEnum(req.result, 're', ['positive','negative','inconclusive','pending','NA']);
  ensureNum(req.allele_freq_pct, 'af'); ensureNum(req.tat_days, 'td');
  ensureEnum(req.clinical_sig, 'cs', ['pathogenic','benign','vus','NA']);
  ensureStr(req.provider, 'pr');
  return { ml_id: `ml_${Date.now()}`, patient_id: req.patient_id, test: req.test_type, gene: req.gene };
}

function funcs() { return { hematology, chemistry, microbiology, transfusion, molecular_lab }; }
module.exports = { funcs, ValidationError };