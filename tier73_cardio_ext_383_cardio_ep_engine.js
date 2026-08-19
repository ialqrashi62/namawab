// filepath: tier73_cardio_ext_383_cardio_ep_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cardiac_cath(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cath_id, 'cid');
  ensureEnum(req.access_site, 'as', ['radial_right','radial_left','femoral_right','femoral_left','ulnar','brachial','other']);
  ensureStr(req.approach, 'ap');
  ensureNum(req.lesion_count, 'lc');
  ensureNum(req.stents_placed, 'sp');
  ensureNum(req.contrast_used_ml, 'cum');
  ensureNum(req.fluoro_time_min, 'ftm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','hematoma','dissection','perforation','stroke','renal_failure','arrhythmia','death','vessel_occlusion','other']);
  ensureBool(req.length_of_stay_overnight, 'loso');
  ensureStr(req.operator, 'op');
  ensureStr(req.lesion_locations, 'll');
  ensureBool(req.planned_pci, 'pp');
  return { cath: req.cath_id };
}
function electrophysiology_study(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['syncope','afib','svt','vt','palpitations','av_block','unexplained','palpitations_stroke','wpw','slow_pathway','other']);
  ensureEnum(req.baseline_rhythm, 'br', ['sinus','afib','aflutter','sinus_brady','junctional','paced','av_block','svt','unknown','other']);
  ensureEnum(req.arrhythmia_induced, 'ai', ['avnrt','avrt','vt','afib','aflutter','atrial_tachy','none','not_induced','other']);
  ensureBool(req.inducible, 'ind');
  ensureEnum(req.vascular_access, 'va', ['femoral_right','femoral_left','femoral_bilateral','internal_jugular','subclavian','other']);
  ensureStr(req.catheters_used, 'cu');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.ablation_performed, 'ap');
  ensureEnum(req.complications, 'comp', ['none','bleeding','tamponade','av_block','stroke','vascular_injury','death','other']);
  ensureStr(req.operator, 'op');
  return { study: req.study_id };
}
function ablation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ablation_id, 'aid');
  ensureEnum(req.arrhythmia, 'arr', ['avnrt','avrt','afib','aflutter','atrial_tachy','vt','atrial_flutter','ventricular_premature','svt','wpw','reentrant','other']);
  ensureEnum(req.energy_source, 'es', ['rf','cryo','pulsed_field','microwave','ultrasound','laser','hybrid','other']);
  ensureStr(req.target, 'target');
  ensureEnum(req.mapping_system, 'ms', ['carto_3','carto_soundstar','ensite','rhythmia','other','none']);
  ensureNum(req.lesions_delivered, 'ld');
  ensureBool(req.success_achieved, 'sa');
  ensureBool(req.acute_success, 'as');
  ensureNum(req.procedure_duration_min, 'pdm');
  ensureEnum(req.complications, 'comp', ['none','bleeding','tamponade','av_block','stroke','vascular_injury','death','phrenic_nerve_palsy','esophageal_injury','other']);
  ensureNum(req.long_term_success_prob, 'ltsp');
  ensureStr(req.operator, 'op');
  return { ablation: req.ablation_id };
}
function device_implant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.device_type, 'dt', ['icd','crt_d','crt_d_crt','s_crt','pacemaker','single_chamber','dual_chamber','leadless_pacemaker','icd_dual_chamber','icd_single_chamber','loop_recorder','icd_subcutaneous','icd_subq','other']);
  ensureStr(req.manufacturer, 'mfr');
  ensureStr(req.model, 'model');
  ensureEnum(req.indication, 'ind', ['primary_prevention','secondary_prevention','av_block','sinus_node_dysfunction','heart_failure','syncope','crt_indicated','other']);
  ensureNum(req.ef_pct, 'ef');
  ensureNum(req.nyha_class, 'nc');
  ensureEnum(req.generator_site, 'gs', ['left_pectoral','right_pectoral','left_axillary','right_axillary','abdominal','left_subcutaneous','abdominal_left','other']);
  ensureNum(req.leads_count, 'lc');
  ensureEnum(req.complications, 'comp', ['none','pneumothorax','hematoma','lead_displacement','infection','cardiac_tamponade','other']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.fluoro_time_min, 'ftm');
  ensureStr(req.operator, 'op');
  ensureNum(req.follow_up_due, 'fud');
  return { device: req.device_id };
}
function wearable_loop_recorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_id, 'did');
  ensureEnum(req.indication, 'ind', ['cryptogenic_stroke','syncope','afib_workup','palpitations','post_ablation','cryptogenic_embolism','other']);
  ensureStr(req.manufacturer, 'mfr');
  ensureStr(req.model, 'model');
  ensureStr(req.inserted, 'in');
  ensureBool(req.transmission_active, 'ta');
  ensureEnum(req.arrhythmia_detected, 'ad', ['afib','aflutter','svt','vt','pause','bradycardia','tachycardia','none','pending','atrial_tachy','other']);
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.battery_years_left, 'byl');
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.monitoring_physician, 'mp');
  return { device: req.device_id };
}

function funcs() { return { cardiac_cath, electrophysiology_study, ablation, device_implant, wearable_loop_recorder }; }
module.exports = { funcs, ValidationError };