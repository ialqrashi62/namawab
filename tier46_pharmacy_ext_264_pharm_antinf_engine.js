// filepath: tier46_pharmacy_ext_264_pharm_antinf_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function antibiotic_stewardship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.culture, 'cx');
  ensureStr(req.antibiotic, 'abx');
  ensureEnum(req.de_escalation, 'de', ['planned_48h','planned_72h','active','not_possible','completed']);
  ensureEnum(req.iv_to_oral, 'ivo', ['planned','eligible','switched','not_applicable']);
  return { antibiotic: req.antibiotic, de_escalation: req.de_escalation };
}
function antifungal_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.drug, 'drug');
  ensureStr(req.culture, 'cx');
  ensureNum(req.duration_days, 'dur');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','cleared']);
  return { drug: req.drug, duration: req.duration_days };
}
function antiviral_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.drug, 'drug');
  ensureNum(req.onset_hours, 'onset');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','critical']);
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  return { drug: req.drug, severity: req.severity };
}
function antiparasitic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.parasite, 'par');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.severity, 'sev', ['uncomplicated','complicated','severe','cerebral']);
  ensureEnum(req.response, 'resp', ['clearing','partial','persistent','worsening']);
  return { drug: req.drug, parasite: req.parasite };
}
function resistance_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture, 'cx');
  ensureStr(req.pattern, 'pat');
  ensureStr(req.antibiotics_active, 'act');
  ensureStr(req.monitoring, 'mon');
  return { pattern: req.pattern, antibiotics_active: req.antibiotics_active };
}

function funcs() { return { antibiotic_stewardship, antifungal_therapy, antiviral_therapy, antiparasitic, resistance_review }; }
module.exports = { funcs, ValidationError };