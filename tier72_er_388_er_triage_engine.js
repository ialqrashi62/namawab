// filepath: tier72_er_388_er_triage_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function rapid_medical_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.arrival_mode, 'am', ['private_vehicle','ambulance','als','bls','helicopter','fixed_wing','police','walk_in','wheelchair','transfer','other']);
  ensureStr(req.chief_complaint, 'cc');
  ensureNum(req.hr, 'hr');
  ensureNum(req.sbp, 'sbp');
  ensureNum(req.dbp, 'dbp');
  ensureNum(req.rr, 'rr');
  ensureNum(req.spo2, 'spo2');
  ensureNum(req.temp_c, 'tc');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.glucose, 'glu');
  ensureNum(req.triage_min, 'tm');
  ensureEnum(req.triage_level, 'tl', ['level_1','level_2','level_3','level_4','level_5','resuscitation','emergent','urgent','less_urgent','non_urgent','fast_track']);
  ensureStr(req.triage_provider, 'tp');
  return { cc: req.chief_complaint };
}
function esi_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.esi_level, 'el');
  ensureNum(req.expected_resources, 'er');
  ensureBool(req.vital_signs_abnormal, 'vsa');
  ensureEnum(req.pain_severity, 'ps', ['none','mild','moderate','severe','very_severe','unknown','other']);
  ensureNum(req.patient_age, 'pa');
  ensureEnum(req.gender, 'gen', ['male','female','non_binary','other','undisclosed','transgender','cisgender','unknown']);
  ensureEnum(req.mental_status, 'ms', ['alert','confused','lethargic','unconscious','obtunded','stuporous','agitated','other']);
  ensureStr(req.presenting, 'pres');
  ensureStr(req.triage_provider, 'tp');
  ensureNum(req.recheck_min, 'rcm');
  return { esi: req.esi_level };
}
function pediatric_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.age_months, 'am');
  ensureEnum(req.presenting, 'pres', ['fever','cough','abdominal_pain','vomiting','diarrhea','rash','laceration','breathing_difficulty','ear_pain','sore_throat','injury','headache','other']);
  ensureNum(req.temp_c, 'tc');
  ensureEnum(req.behavior, 'beh', ['active','lethargic','inconsolable','calm','irritable','agitated','withdrawn','distressed','other']);
  ensureEnum(req.hydration, 'hyd', ['normal','mild_dehydration','moderate_dehydration','severe_dehydration','over_hydration','unknown','other']);
  ensureBool(req.immunizations_up_to_date, 'iud');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.pediatric_assessment_triangle, 'pat', ['stable','abnormal','critical','normal','other']);
  ensureEnum(req.triage_level, 'tl', ['level_1','level_2','level_3','level_4','level_5','fast_track','pediatric_high','pediatric_low','resuscitation','emergent','urgent','non_urgent','other']);
  ensureStr(req.triage_provider, 'tp');
  return { age: req.age_years };
}
function psychiatric_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mental_status, 'ms', ['alert','confused','lethargic','unconscious','obtunded','stuporous','agitated','psychotic','disorganized','oriented','disoriented','altered','other']);
  ensureBool(req.suicidal_ideation, 'si');
  ensureBool(req.homicidal_ideation, 'hi');
  ensureBool(req.psychosis_present, 'pp');
  ensureBool(req.substance_use_disorder, 'sud');
  ensureBool(req.threats_against_self, 'tas');
  ensureBool(req.restraints_required, 'rr');
  ensureBool(req.sitter_required, 'sr');
  ensureBool(req.psych_consult_ordered, 'pco');
  ensureBool(req.bed_assigned, 'ba');
  ensureStr(req.triage_provider, 'tp');
  return { ms: req.mental_status };
}
function obstetric_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.fundal_height_cm, 'fhc');
  ensureNum(req.fetal_heart_rate, 'fhr');
  ensureEnum(req.contractions, 'cont', ['none','irregular','regular_brief','regular_intense','active_labor','prodromal','not_assessed','other']);
  ensureBool(req.rupture_of_membranes, 'rom');
  ensureStr(req.bp, 'bp');
  ensureBool(req.proteinuria, 'prot');
  ensureBool(req.high_risk_pregnancy, 'hrp');
  ensureBool(req.labor_appropriate, 'la');
  ensureBool(req.ob_consulted, 'oc');
  ensureStr(req.triage_provider, 'tp');
  return { gaw: req.gestational_age_weeks };
}

function funcs() { return { rapid_medical_assessment, esi_triage, pediatric_triage, psychiatric_triage, obstetric_triage }; }
module.exports = { funcs, ValidationError };