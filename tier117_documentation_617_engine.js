// filepath: tier117_documentation_617_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function clinical_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.note_id, 'nid');
  ensureEnum(req.type, 'tp', ['history','physical','consultation','procedure','operative','progress','discharge','other','unknown']);
  ensureNum(req.length_chars, 'lc');
  ensureBool(req.completed, 'comp');
  ensureNum(req.time_to_complete, 'ttc');
  ensureBool(req.attested, 'att');
  ensureStr(req.provider, 'pr');
  return { nid: req.note_id };
}
function discharge_summary(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.summary_id, 'sid');
  ensureStr(req.primary_diagnosis, 'pd');
  ensureNum(req.procedures_count, 'pc');
  ensureNum(req.medications_count, 'mc');
  ensureNum(req.follow_up_count, 'fuc');
  ensureBool(req.signed, 'sgn');
  ensureStr(req.provider, 'pr');
  return { sid: req.summary_id };
}
function procedure_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.note_id, 'nid');
  ensureStr(req.procedure, 'proc');
  ensureStr(req.indication, 'ind');
  ensureNum(req.findings_count, 'fc');
  ensureNum(req.complications_count, 'cc');
  ensureBool(req.consent, 'con');
  ensureStr(req.provider, 'pr');
  return { nid: req.note_id };
}
function consultation_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.note_id, 'nid');
  ensureStr(req.consultant, 'cons');
  ensureStr(req.specialty, 'sp');
  ensureNum(req.recommendations_count, 'rc');
  ensureBool(req.follow_up_scheduled, 'fus');
  ensureNum(req.response_hours, 'rh');
  ensureStr(req.provider, 'pr');
  return { nid: req.note_id };
}
function progress_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.note_id, 'nid');
  ensureNum(req.day_of_stay, 'dos');
  ensureNum(req.subjective_lines, 'sl');
  ensureNum(req.objective_findings, 'of');
  ensureEnum(req.status, 'st', ['improving','stable','worsening','critical','other','unknown']);
  ensureBool(req.plan_updated, 'pu');
  ensureStr(req.provider, 'pr');
  return { nid: req.note_id };
}

function funcs() { return { clinical_note, discharge_summary, procedure_note, consultation_note, progress_note }; }
module.exports = { funcs, ValidationError };