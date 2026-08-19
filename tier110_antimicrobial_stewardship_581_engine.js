// filepath: tier110_antimicrobial_stewardship_581_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function culture_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.specimen, 'sp');
  ensureStr(req.organism, 'org');
  ensureNum(req.days_to_positive, 'dtp');
  ensureNum(req.sensitivities_tested, 'st');
  ensureEnum(req.resistance_pattern, 'rp', ['sensitive','esbl','cre','mrsa','vre','multidrug_resistant','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { cid: req.culture_id };
}
function antibiotic_choice(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.choice_id, 'cid');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.class, 'cl', ['penicillin','cephalosporin','carbapenem','fluoroquinolone','macrolide','vancomycin','linezolid','other','unknown']);
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.frequency_per_day, 'fpd');
  ensureBool(req.deescalation, 'de');
  ensureNum(req.days_of_therapy, 'dot');
  ensureStr(req.provider, 'pr');
  return { cid: req.choice_id };
}
function duration_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.indication, 'ind');
  ensureNum(req.current_days, 'cd');
  ensureNum(req.recommended_days, 'rd');
  ensureBool(req.extension_justified, 'ej');
  ensureNum(req.excess_days, 'exd');
  ensureEnum(req.status, 'st', ['appropriate','too_short','too_long','appropriate_but_continue','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function iv_to_po_switch(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.switch_id, 'sid');
  ensureStr(req.medication, 'med');
  ensureNum(req.current_iv_dose, 'civ');
  ensureNum(req.po_bioavailability, 'pb');
  ensureNum(req.days_on_iv, 'doi');
  ensureBool(req.switch_criteria_met, 'scm');
  ensureEnum(req.outcome, 'out', ['switched','continued_iv','declined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.switch_id };
}
function resistance_pattern(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.resistance_id, 'rid');
  ensureStr(req.organism, 'org');
  ensureNum(req.isolates_count, 'ic');
  ensureNum(req.resistant_count, 'rc');
  ensureNum(req.resistance_pct, 'rp');
  ensureEnum(req.trend, 'tr', ['increasing','stable','decreasing','other','unknown']);
  ensureEnum(req.antibiotic_class, 'ac', ['penicillin','cephalosporin','carbapenem','fluoroquinolone','macrolide','vancomycin','linezolid','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.resistance_id };
}

function funcs() { return { culture_review, antibiotic_choice, duration_assessment, iv_to_po_switch, resistance_pattern }; }
module.exports = { funcs, ValidationError };