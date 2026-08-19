// filepath: tier110_adverse_drug_reaction_583_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function reaction_reporting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.medication, 'med');
  ensureStr(req.reaction, 'rxn');
  ensureNum(req.onset_hours, 'oh');
  ensureEnum(req.outcome, 'out', ['resolved','ongoing','resolved_with_sequelae','fatal','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}
function causality_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.causality_id, 'cid');
  ensureStr(req.medication, 'med');
  ensureStr(req.reaction, 'rxn');
  ensureNum(req.score, 'sc');
  ensureEnum(req.scale, 'sc', ['naranjo','who','karch','other','unknown']);
  ensureEnum(req.causality, 'cau', ['definite','probable','possible','unlikely','unrelated','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { cid: req.causality_id };
}
function severity_grading(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.severity_id, 'sid');
  ensureStr(req.reaction, 'rxn');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','fatal','other','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureBool(req.hospitalization, 'hosp');
  ensureStr(req.provider, 'pr');
  return { sid: req.severity_id };
}
function allergy_labeling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.allergy_id, 'aid');
  ensureStr(req.medication, 'med');
  ensureStr(req.reaction, 'rxn');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','fatal','other','unknown']);
  ensureBool(req.added_to_chart, 'atc');
  ensureBool(req.alert_set, 'as');
  ensureStr(req.provider, 'pr');
  return { aid: req.allergy_id };
}
function reporting_to_fda(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fda_id, 'fid');
  ensureStr(req.medication, 'med');
  ensureStr(req.reaction, 'rxn');
  ensureBool(req.serious, 'ser');
  ensureBool(req.report_filed, 'rf');
  ensureStr(req.medwatch_number, 'mwn');
  ensureStr(req.provider, 'pr');
  return { fid: req.fda_id };
}

function funcs() { return { reaction_reporting, causality_assessment, severity_grading, allergy_labeling, reporting_to_fda }; }
module.exports = { funcs, ValidationError };