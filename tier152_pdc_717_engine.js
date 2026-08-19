// filepath: tier152_pdc_717_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function fetal_echocardiogram(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.fetus_id, 'fi');
  ensureNum(req.ga_weeks, 'gw');
  ensureNum(req.heart_rate, 'hr');
  ensureEnum(req.indication, 'in', ['routine','maternal_diabetes','maternal_lupus','maternal_Rubella','family_history_CHD','abnormal_screening','fetal_arrhythmia','IUGR','polyhydramnios','twin_to_twin_transfusion','IVF_pregnancy','advanced_maternal_age','NA']);
  ensureEnum(req.diagnosis, 'dx', ['normal','HLHS','TOF','VSD','ASD','AVSD','TGA','truncus_arteriosus','Ebstein','coarctation','hypoplastic_arch','pulmonary_stenosis','pulmonary_atreisa','DORV','TAPVR','tricuspid_atreisa','HLHS_variant','other','NA']);
  ensureNum(req.cardio_thoracic_ratio, 'ct');
  ensureNum(req.ventricular_size, 'vs');
  ensureNum(req.great_vessel_ratio, 'gv');
  ensureBool(req.fluid_effusion, 'fe');
  ensureStr(req.provider, 'pr');
  return { fe_id: `fec_${Date.now()}`, fetus_id: req.fetus_id, dx: req.diagnosis };
}
function congenital_dx(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.lesion, 'ls', ['VSD','ASD','PDA','TOF','TGA','HLHS','AVSD','truncus_arteriosus','Ebstein','pulmonary_stenosis','aortic_stenosis','coarctation','interrupted_arch','coronary_anomaly','ALCAPA','TOF_with_PA','pulmonary_atreisa','tricuspid_atreisa','TAPVR','other','NA']);
  ensureNum(req.size_mm, 'sz');
  ensureNum(req.gradient_mmhg, 'gr');
  ensureEnum(req.shunt, 'sh', ['none','L_R','R_L','bidirectional','NA']);
  ensureNum(req.saturation_pct, 'sa');
  ensureNum(req.lvef_pct, 'le');
  ensureBool(req.cyanosis, 'cy');
  ensureBool(req.failure_to_thrive, 'ft');
  ensureStr(req.provider, 'pr');
  return { cd_id: `cdx_${Date.now()}`, patient_id: req.patient_id, lesion: req.lesion };
}
function peds_cath(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['diagnostic','interventional_VSD','interventional_ASD','interventional_PDA','interventional_coarct','valvuloplasty','angioplasty','stent','biopsy','ablation','closure','test_occlusion','other']);
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.fluoro_min, 'fm');
  ensureNum(req.dose_mgy, 'ds');
  ensureEnum(req.access, 'ac', ['femoral','jugular','carotid','umbilical','hybrid','NA']);
  ensureNum(req.contrast_ml, 'cn');
  ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.successful, 'su');
  ensureEnum(req.complication, 'cp', ['none','arrhythmia','tamponade','vessel_injury','stroke','bleeding','other']);
  ensureStr(req.provider, 'pr');
  return { pc_id: `pdc_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function arrhythmia_peds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['WPW','AVRT','AVNRT','atrial_ectopic','ventricular_ectopic','SVT','VT','congenital_AV_block','acquired_AV_block','long_QT','Brugada','CPVT','ARVD','fetal_arrhythmia','other','NA']);
  ensureNum(req.age_onset_months, 'ao');
  ensureNum(req.hr_max, 'hm');
  ensureNum(req.hr_min, 'hn');
  ensureBool(req.sustained, 'su');
  ensureNum(req.episode_count, 'ec');
  ensureBool(req.ablation_done, 'ad');
  ensureBool(req.recurrence, 'rc');
  ensureEnum(req.medication, 'md', ['none','beta_blocker','flecainide','propafenone','sotalol','amiodarone','digoxin','CCB','other']);
  ensureEnum(req.sudden_risk, 'sr', ['low','intermediate','high','unknown']);
  ensureStr(req.provider, 'pr');
  return { ar_id: `arr_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function single_ventricle(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.anatomy, 'an', ['HLHS','HRHS','HLHS_variant','double_inlet_LV','double_inlet_RV','unbalanced_AVSD','TGA_single_ventricle','PA_IVS','straddling_AV_valve','other','NA']);
  ensureNum(req.stage, 'st');
  ensureNum(req.stage_age_months, 'sa');
  ensureEnum(req.stage_type, 'tp', ['stage_1_norwood','stage_1_glenn','stage_2_glenn','stage_2_fontan','fontan','hybrid','other','NA']);
  ensureBool(req.completed, 'cm');
  ensureNum(req.saturation_pct, 'so');
  ensureNum(req.lvef_pct, 'le');
  ensureBool(req.fenestration, 'fn');
  ensureNum(req.band_pressure, 'bp');
  ensureStr(req.provider, 'pr');
  return { sv_id: `svt_${Date.now()}`, patient_id: req.patient_id, anatomy: req.anatomy };
}

function funcs() { return { fetal_echocardiogram, congenital_dx, peds_cath, arrhythmia_peds, single_ventricle }; }
module.exports = { funcs, ValidationError };