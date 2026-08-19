// filepath: tier75_pulm_ext_400_pulm_proc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bronchoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureStr(req.findings, 'find');
  ensureBool(req.bal_performed, 'bp');
  ensureNum(req.biopsies_taken, 'biot');
  ensureEnum(req.complications, 'comp', ['none','bleeding','pneumothorax','hypoxia','arrhythmia','laryngospasm','bronchospasm','pneumonia','death','multiple','other']);
  ensureNum(req.procedure_duration_min, 'pdm');
  ensureBool(req.conscious_sedation_used, 'csu');
  ensureNum(req.recovery_time_min, 'rtm');
  ensureStr(req.provider, 'pr');
  ensureBool(req.pathology_results_pending, 'prp');
  return { pid: req.procedure_id };
}
function thoracentesis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.side, 'side', ['right','left','bilateral','right_lower','right_middle','left_lower','unknown','other']);
  ensureNum(req.fluid_volume_removed_ml, 'fvrm');
  ensureEnum(req.fluid_color, 'fc', ['amber','yellow','bloody','serous','serosanguinous','green','brown','black','pus','other']);
  ensureBool(req.fluid_sent_for_analysis, 'fsa');
  ensureBool(req.ultrasound_guided, 'ug');
  ensureEnum(req.complications, 'comp', ['none','pneumothorax','hemorrhage','infection','re_expansion_pulmonary_edema','pain','hematoma','multiple','other']);
  ensureStr(req.pre_post_cxr_findings, 'ppcf');
  ensureStr(req.provider, 'pr');
  ensureBool(req.patient_tolerated, 'pt');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function chest_tube_placement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['pneumothorax','hemothorax','effusion','empyema','chylothorax','pleural_drainage','post_op','other']);
  ensureEnum(req.side, 'side', ['right','left','bilateral','right_lower','left_lower','unknown','other']);
  ensureNum(req.tube_size_fr, 'tsf');
  ensureEnum(req.placement_method, 'pm', ['bedside','image_guided','surgical','thoracoscopic','other']);
  ensureNum(req.output_first_3h_ml, 'of3');
  ensureNum(req.suction_cm_h2o, 'sch');
  ensureEnum(req.complications, 'comp', ['none','organ_injury','hemorrhage','infection','dislodgement','subcutaneous_emphysema','kinking','malposition','other']);
  ensureBool(req.water_seal_intact, 'wsi');
  ensureStr(req.provider, 'pr');
  ensureStr(req.plan, 'plan');
  ensureNum(req.patient_comfort_pain, 'pcp');
  return { pid: req.procedure_id };
}
function endobronchial_ultrasound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indication, 'ind');
  ensureNum(req.stations_sampled, 'ss');
  ensureNum(req.lymph_nodes_sampled, 'lns');
  ensureNum(req.tbna_needle_passes, 'tnp');
  ensureEnum(req.complications, 'comp', ['none','bleeding','pneumothorax','infection','arrhythmia','pneumomediastinum','other']);
  ensureNum(req.procedure_duration_min, 'pdm');
  ensureStr(req.provider, 'pr');
  ensureStr(req.lymph_node_stations, 'lns2');
  ensureBool(req.pathology_results_pending, 'prp');
  ensureBool(req.adept_review, 'ar');
  return { pid: req.procedure_id };
}
function pleuroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.indicator, 'ind');
  ensureNum(req.biopsies_taken, 'bt');
  ensureBool(req.pleurodesis_performed, 'pp');
  ensureStr(req.agent, 'ag');
  ensureEnum(req.complications, 'comp', ['none','bleeding','empyema','pneumonia','pain','infection','death','other']);
  ensureNum(req.procedure_duration_min, 'pdm');
  ensureBool(req.contraindications_screened, 'cs');
  ensureStr(req.provider, 'pr');
  ensureStr(req.follow_up, 'fu');
  ensureBool(req.patient_consent, 'pc');
  return { pid: req.procedure_id };
}

function funcs() { return { bronchoscopy, thoracentesis, chest_tube_placement, endobronchial_ultrasound, pleuroscopy }; }
module.exports = { funcs, ValidationError };