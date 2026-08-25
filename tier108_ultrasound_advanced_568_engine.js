// filepath: tier108_ultrasound_advanced_568_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function echo_complete(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ef, 'ef');
  ensureNum(req.wall_motion_abnormalities, 'wma');
  ensureEnum(req.valve_function, 'vf', ['normal','mild_mr','moderate_mr','severe_mr','stenosis','multiple','other','unknown']);
  ensureNum(req.diastolic_dysfunction, 'dd');
  ensureEnum(req.right_ventricular_function, 'rvf', ['normal','mildly_depressed','moderately_depressed','severely_depressed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function vascular_duplex(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.vessel, 'vs', ['carotid','vertebral','aorta','iliac','femoral','popliteal','renal','mesenteric','other','unknown']);
  ensureNum(req.stenosis_pct, 'sp');
  ensureEnum(req.plaque_characterization, 'pc', ['none','calcified','mixed','soft','ulcerated','other','unknown']);
  ensureNum(req.peak_systolic_velocity, 'psv');
  ensureEnum(req.findings, 'fd', ['normal','insignificant_stenosis','significant_stenosis','occlusion','aneurysm','dissection','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function point_of_care_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.location, 'loc', ['fast','lung','cardiac','ivc','bladder','aorta','gallbladder','other','unknown']);
  ensureEnum(req.view, 'vw', ['subxiphoid','parasternal','apical','suprapubic','abdominal','transverse','sagittal','other','unknown']);
  ensureEnum(req.indication, 'ind', ['shock','dyspnea','trauma','line_placement','pain','other','unknown']);
  ensureNum(req.tamponade_signs, 'ts');
  ensureNum(req.ivc_diameter, 'ivcd');
  ensureEnum(req.fluid_responsiveness, 'fr', ['yes','no','equivocal','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function elastography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.organ, 'org', ['liver','breast','thyroid','prostate','spleen','lymph_node','other','unknown']);
  ensureEnum(req.fibrosis_stage, 'fs', ['f0','f1','f2','f3','f4','other','unknown']);
  ensureNum(req.stiffness_kpa, 'sk');
  ensureEnum(req.probe_used, 'pu', ['shear_wave','transient','strain','other','unknown']);
  ensureNum(req.fat_fraction, 'ff');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function contrast_echo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.agent, 'ag', ['definity','optison','luminity','other','unknown']);
  ensureEnum(req.indication, 'ind', ['cardiac','mass','thrombus','shunt','other','unknown']);
  ensureEnum(req.chamber_visualization, 'cv', ['enhanced','limited','poor','other','unknown']);
  ensureBool(req.perfusion_imaging, 'pi');
  ensureBool(req.left_atrial_thrombus, 'lat');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}

function funcs() { return { echo_complete, vascular_duplex, point_of_care_us, elastography, contrast_echo }; }
module.exports = { funcs, ValidationError };