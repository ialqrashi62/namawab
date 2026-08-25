// filepath: tier161_pod_758_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function foot_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureBool(req.diabetic, 'db');
  ensureEnum(req.skin_status, 'ss', ['intact','dry','macerated','fissured','ulcerated','infected','NA']);
  ensureNum(req.skin_temp_c, 'st'); ensureBool(req.peripheral_pulses, 'pp');
  ensureEnum(req.pedal_pulse, 'pu', ['normal','diminished','absent','bounding','NA']);
  ensureNum(req.mono_filament_score, 'mf'); ensureNum(req.vibration_score, 'vs');
  ensureEnum(req.sensation, 'sn', ['normal','reduced','absent','NA']);
  ensureStr(req.provider, 'pr');
  return { fa_id: `fa_${Date.now()}`, patient_id: req.patient_id, skin: req.skin_status, pedal: req.pedal_pulse };
}

function diabetic_foot(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.hba1c, 'h1'); ensureNum(req.duration_diabetes_yrs, 'dd');
  ensureEnum(req.wagner_grade, 'wg', ['0','1','2','3','4','5','NA']);
  ensureEnum(req.texas_stage, 'tx', ['A','B','C','D','NA']);
  ensureNum(req.ulcer_size_cm, 'us'); ensureNum(req.ulcer_depth_mm, 'ud');
  ensureBool(req.infection, 'in'); ensureEnum(req.infection_type, 'it', ['cellulitis','abscess','osteomyelitis','none','NA']);
  ensureBool(req.vascular_assessment, 'va'); ensureNum(req.ankle_brachial_index, 'ab');
  ensureStr(req.provider, 'pr');
  return { df_id: `df_${Date.now()}`, patient_id: req.patient_id, wagner: req.wagner_grade, ulc_size: req.ulcer_size_cm };
}

function biomechanics(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.arch_type, 'at', ['normal','cavus','planus','neutral','NA']);
  ensureNum(req.pes_planus_angle, 'pa'); ensureNum(req.hallux_abductus_angle, 'ha');
  ensureEnum(req.gait_pattern, 'gp', ['normal','in_toeing','out_toeing','antalgic','steppage','other','NA']);
  ensureNum(req.q_angle_deg, 'qa'); ensureNum(req.foot_posture_index, 'fp');
  ensureEnum(req.recommendation, 'rc', ['none','orthotics','PT','surgery','combination','NA']);
  ensureBool(req.shoe_modification, 'sm'); ensureEnum(req.activity_level, 'al', ['sedentary','moderate','active','athlete','NA']);
  ensureStr(req.provider, 'pr');
  return { bm_id: `bm_${Date.now()}`, patient_id: req.patient_id, arch: req.arch_type, gait: req.gait_pattern };
}

function nail_surgery(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.pathology, 'pa', ['ingrown','fungal','deformed','paronychia','subungual_exostosis','other','NA']);
  ensureBool(req.recurrence, 'rc'); ensureNum(req.previous_procedures, 'pp');
  ensureEnum(req.procedure, 'pr', ['partial_avulsion','total_avulsion','matrixectomy','nail_lift','other','NA']);
  ensureNum(req.lidocaine_mg, 'lm'); ensureNum(req.tourniquet_min, 'tm');
  ensureBool(req.antibiotic_prophylaxis, 'ap'); ensureEnum(req.healing_stage, 'hs', ['normal','delayed','infection','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { ns_id: `ns_${Date.now()}`, patient_id: req.patient_id, path: req.pathology, procedure: req.procedure };
}

function wound_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.wound_size_cm, 'ws'); ensureNum(req.wound_depth_mm, 'wd');
  ensureEnum(req.wagner_grade, 'wg', ['0','1','2','3','4','5','NA']);
  ensureEnum(req.exudate, 'ex', ['none','serous','serosanguinous','purulent','NA']);
  ensureBool(req.infection, 'in'); ensureEnum(req.dressing_type, 'dt', ['gauze','hydrocolloid','foam','alginate','collagen','other','NA']);
  ensureNum(req.healing_rate_pct_30d, 'hr'); ensureBool(req.offloading, 'of');
  ensureEnum(req.disposition, 'di', ['home','inpatient','home_health','clinic','other','NA']);
  ensureStr(req.provider, 'pr');
  return { wc_id: `wc_${Date.now()}`, patient_id: req.patient_id, size: req.wound_size_cm, healing: req.healing_rate_pct_30d };
}

function funcs() { return { foot_assessment, diabetic_foot, biomechanics, nail_surgery, wound_care }; }
module.exports = { funcs, ValidationError };