// filepath: tier94_pulm_pleural_497_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pleural_effusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.side, 'sd', ['right','left','bilateral','other','unknown']);
  ensureEnum(req.fluid_type, 'ft', ['transudate','exudate','indeterminate','other','unknown']);
  ensureNum(req.protein_fluid, 'pf');
  ensureNum(req.ldh_fluid, 'lf');
  ensureNum(req.glucose_fluid, 'gf');
  ensureNum(req.cell_count, 'cc');
  ensureEnum(req.cell_differential, 'cd', ['lymphocytes','neutrophils','mixed','eosinophils','other','unknown']);
  ensureNum(req.wbc_fluid, 'wf');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function thoracentesis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.side, 'sd', ['right','left','bilateral','other','unknown']);
  ensureNum(req.volume_ml, 'vm');
  ensureEnum(req.fluid_appearance, 'fa', ['straw','bloody','turbid','purulent','milky','other','unknown']);
  ensureBool(req.ultrasound_guided, 'ug');
  ensureNum(req.complications, 'comp');
  ensureBool(req.symptom_relief, 'sr');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function chest_tube(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureNum(req.size_fr, 'sfr');
  ensureEnum(req.side, 'sd', ['right','left','bilateral','other','unknown']);
  ensureNum(req.duration_days, 'dur');
  ensureNum(req.suction, 'suct');
  ensureBool(req.underwater_seal, 'us');
  ensureBool(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function pleurodesis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.agent, 'ag', ['talc','bleomycin','doxycycline','tetracycline','other','unknown']);
  ensureNum(req.success_rate, 'sr');
  ensureBool(req.recurrence, 'rec');
  ensureEnum(req.follow_up_imaging, 'fui', ['resolved','improved','stable','worse','other','unknown']);
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function empyema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.empyema_present, 'ep');
  ensureNum(req.fluid_ph, 'ph');
  ensureNum(req.glucose, 'glu');
  ensureBool(req.loculations, 'loc');
  ensureEnum(req.treatment, 'tx', ['antibiotics','chest_tube_fibrinolytics','vat_decortication','combination','other','unknown','none']);
  ensureBool(req.surgery_required, 'sr');
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { pleural_effusion, thoracentesis, chest_tube, pleurodesis, empyema }; }
module.exports = { funcs, ValidationError };
