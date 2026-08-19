// filepath: tier94_pulm_vascular_496_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pah_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.mean_pap, 'mpap');
  ensureNum(req.pulmonary_capillary_wedge, 'pcwp');
  ensureNum(req.cardiac_output, 'co');
  ensureNum(req.pulmonary_vascular_resistance, 'pvr');
  ensureEnum(req.who_functional_class, 'wfc', ['1','2','3','4','unknown','other']);
  ensureNum(req.six_min_walk, '6mw');
  ensureNum(req.ntprobnp, 'ntp');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cteph(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.cteph_present, 'cp');
  ensureNum(req.perfusion_defects, 'pdef');
  ensureNum(req.segmental_defects, 'sdef');
  ensureBool(req.pulmonary_angiogram_done, 'pag');
  ensureBool(req.riociguat, 'rio');
  ensureBool(req.endarterectomy_candidate, 'ec');
  ensureNum(req.duration_months, 'dur');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pulmonary_edema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.edema_type, 'et', ['cardiogenic','non_cardiogenic','mixed','other','unknown']);
  ensureNum(req.bnp, 'bnp');
  ensureNum(req.ejection_fraction, 'ef');
  ensureEnum(req.edema_onset, 'eo', ['acute','subacute','chronic','other','unknown']);
  ensureNum(req.weight_gain_kg, 'wgt');
  ensureNum(req.diuretic_response, 'dr');
  ensureNum(req.fluid_balance, 'fb');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pulmonary_embolism(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.wells_score, 'ws');
  ensureNum(req.d_dimer, 'dd');
  ensureEnum(req.imaging, 'img', ['cta','vq','mra','other','unknown','none']);
  ensureEnum(req.location, 'loc', ['unilateral','bilateral','segmental','subsegmental','massive','other','unknown']);
  ensureBool(req.right_ventricular_dysfunction, 'rvd');
  ensureNum(req.troponin, 'tro');
  ensureEnum(req.treatment, 'tx', ['anticoagulation','thrombolytics','catheter_directed','surgical','supportive','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pulmonary_hypertension(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.mean_pap, 'mpap');
  ensureNum(req.pulmonary_capillary_wedge, 'pcwp');
  ensureNum(req.pulmonary_vascular_resistance, 'pvr');
  ensureEnum(req.who_functional_class, 'wfc', ['1','2','3','4','unknown','other']);
  ensureEnum(req.treatment, 'tx', ['vasodilator','combination','supportive','other','unknown','none']);
  ensureBool(req.reversal_therapy, 'rt');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { pah_diagnosis, cteph, pulmonary_edema, pulmonary_embolism, pulmonary_hypertension }; }
module.exports = { funcs, ValidationError };
