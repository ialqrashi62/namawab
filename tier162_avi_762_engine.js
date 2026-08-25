// filepath: tier162_avi_762_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pilot_exam(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.cert_class, 'cc', ['first','second','third','recreational','instructor','NA']);
  ensureNum(req.flight_hours, 'fh'); ensureBool(req.medical_completed, 'mc');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.hr, 'hr');
  ensureNum(req.vision_20_20, 'v2'); ensureBool(req.hearing_normal, 'hn');
  ensureEnum(req.cardiovascular_clearance, 'cv', ['normal','abnormal','pending','NA']);
  ensureEnum(req.outcome, 'ot', ['issued','deferred','denied','pending','NA']);
  ensureBool(req.restrictions, 'rs'); ensureStr(req.provider, 'pr');
  return { pe_id: `pe_${Date.now()}`, patient_id: req.patient_id, cert: req.cert_class, outcome: req.outcome };
}

function decompression(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.altitude_change_ft, 'af'); ensureNum(req.ascent_rate_ft_min, 'ar');
  ensureNum(req.spo2_predicted, 'sp'); ensureNum(req.time_at_altitude_min, 'ta');
  ensureEnum(req.pre_breathing, 'pb', ['oxygen','mixed','none','NA']);
  ensureBool(req.symptoms, 'sx'); ensureEnum(req.symptom_type, 'st', ['joint','neurologic','respiratory','skin','none','NA']);
  ensureNum(req.dcs_risk_pct, 'dr'); ensureBool(req.treatment_needed, 'tn');
  ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, patient_id: req.patient_id, altitude: req.altitude_change_ft, risk: req.dcs_risk_pct };
}

function hypoxia(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.altitude_ft, 'af'); ensureNum(req.time_at_altitude_min, 'ta');
  ensureNum(req.spo2, 'sp'); ensureNum(req.heart_rate, 'hr');
  ensureBool(req.symptoms, 'sx'); ensureEnum(req.symptom, 'sy', ['none','mild','moderate','severe','loss_of_consciousness','NA']);
  ensureNum(req.cabin_pressure_inHg, 'cp'); ensureBool(req.oxygen_supplement, 'os');
  ensureEnum(req.treatment, 'tr', ['oxygen','descend','rest','monitor','NA']);
  ensureStr(req.provider, 'pr');
  return { hy_id: `hy_${Date.now()}`, patient_id: req.patient_id, spo2: req.spo2, symptom: req.symptom };
}

function g_force(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.peak_g, 'pg'); ensureNum(req.duration_g_sec, 'dg');
  ensureNum(req.g_direction, 'gd'); ensureBool(req.g_lOC, 'gl');
  ensureNum(req.anti_g_suit_used, 'ag'); ensureEnum(req.maneuver_type, 'mt', ['turn','climb','descent','spin','combat','other','NA']);
  ensureBool(req.injury, 'in'); ensureEnum(req.injury_type, 'it', ['none','musculoskeletal','cervical','vascular','NA']);
  ensureNum(req.recovery_min, 'rc'); ensureStr(req.provider, 'pr');
  return { gf_id: `gf_${Date.now()}`, patient_id: req.patient_id, peak: req.peak_g, loc: req.g_lOC };
}

function hyperbaric(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.treatment_depth_ft, 'td'); ensureNum(req.duration_min, 'du');
  ensureNum(req.gas_mix, 'gm'); ensureNum(req.session_count, 'sc');
  ensureEnum(req.indication, 'in', ['DCS','AGE','CO_poison','wound','radiation','infection','other','NA']);
  ensureNum(req.pre_post_neuro, 'pn'); ensureBool(req.improvement, 'im');
  ensureEnum(req.tolerated, 'tl', ['well','moderate','poor','NA']);
  ensureEnum(req.complication, 'co', ['none','barotrauma','oxygen_toxicity','seizure','other','NA']);
  ensureStr(req.provider, 'pr');
  return { hb_id: `hb_${Date.now()}`, patient_id: req.patient_id, depth: req.treatment_depth_ft, sessions: req.session_count };
}

function funcs() { return { pilot_exam, decompression, hypoxia, g_force, hyperbaric }; }
module.exports = { funcs, ValidationError };