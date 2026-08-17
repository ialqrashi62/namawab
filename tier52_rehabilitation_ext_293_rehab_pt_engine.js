// filepath: tier52_rehabilitation_ext_293_rehab_pt_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stroke_type, 'st', ['ischemic_left_mca','ischemic_right_mca','ischemic_basilar','hemorrhagic_lobar','hemorrhic_ich']);
  ensureNum(req.days_since_onset, 'dso');
  ensureNum(req.fugl_meyer, 'fm');
  ensureNum(req.berg_balance, 'bb');
  ensureStr(req.therapy_focus, 'tf');
  ensureEnum(req.discharge_plan, 'dp', ['home_with_outpatient','inpatient_rehab','snf','acute_rehab','long_term_care']);
  return { fugl_meyer: req.fugl_meyer, berg_balance: req.berg_balance };
}
function spinal_cord_injury_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.level, 'lvl', ['c1_c4','c5_c8','t1_t6','t7_t12','l1_l5','sacral']);
  ensureEnum(req.ais, 'ais', ['a','b','c','d','e']);
  ensureNum(req.time_since_injury_months, 'tsi');
  ensureNum(req.fim_score, 'fim');
  ensureStr(req.goals, 'goals');
  ensureNum(req.pressure_relief_q_hours, 'pr');
  return { level: req.level, ais: req.ais };
}
function amputee_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.level, 'lvl', ['toe','transmetatarsal','below_knee','knee_disarticulation','above_knee','hip_disarticulation','transhumeral','above_elbow','below_elbow']);
  ensureStr(req.side, 'sd');
  ensureNum(req.time_since_amp_months, 't');
  ensureStr(req.prosthesis_fitting, 'pf');
  ensureEnum(req.gait_training_intensity, 'gti', ['daily_pre_prosthetic','3x_week','2x_week','weekly','transitioning']);
  ensureStr(req.complications, 'comp');
  return { level: req.level, side: req.side };
}
function balance_vestibular(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.condition, 'cond');
  ensureStr(req.side, 'sd');
  ensureStr(req.dix_hallpike, 'dh');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['resolved','partial','persistent','worsening']);
  ensureNum(req.follow_up, 'fu');
  return { condition: req.condition };
}
function gait_training(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.assistive_device, 'ad', ['none','straight_cane','quad_cane','rolling_walker','wheeled_walker','axillary_crutch','forearm_crutch']);
  ensureNum(req.distance_m, 'dist');
  ensureNum(req.symmetry_index, 'si');
  ensureEnum(req.fall_risk, 'fr', ['low','moderate','high']);
  ensureBool(req.surface_varied, 'sv');
  ensureEnum(req.outcome, 'out', ['progressing','plateau','regressing','discharge']);
  return { distance: req.distance_m };
}

function funcs() { return { stroke_rehab, spinal_cord_injury_rehab, amputee_rehab, balance_vestibular, gait_training }; }
module.exports = { funcs, ValidationError };