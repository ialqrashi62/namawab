// filepath: tier144_neon_685_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function apgar(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.appearance, 'ap');
  ensureNum(req.pulse, 'pu');
  ensureNum(req.grimace, 'gr');
  ensureNum(req.activity, 'ac');
  ensureNum(req.respiration, 're');
  ensureNum(req.apgar_1, 'a1');
  ensureNum(req.apgar_5, 'a5');
  ensureNum(req.apgar_10, 'a10');
  ensureStr(req.provider, 'pr');
  return { ap_id: `apgar_${Date.now()}`, patient_id: req.patient_id, apgar_1: req.apgar_1, apgar_5: req.apgar_5, apgar_10: req.apgar_10 };
}
function bilimeter(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_hours, 'ah');
  ensureNum(req.bili_total, 'bt');
  ensureNum(req.bili_direct, 'bd');
  ensureNum(req.bili_indirect, 'bi');
  ensureEnum(req.phototherapy, 'pt', ['none','conventional','intensive','double','exchange','home']);
  ensureNum(req.threshold_above, 'th');
  ensureBool(req.bili_alert, 'ba');
  ensureStr(req.provider, 'pr');
  return { bi_id: `bili_${Date.now()}`, patient_id: req.patient_id, bili_total: req.bili_total, alert: req.bili_alert };
}
function feeding(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.feed_type, 'ft', ['breast','formula','mixed','TPN','donor_milk','enteral','parenteral','NPO']);
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.feeds_per_day, 'fd');
  ensureNum(req.weight_gain_g_day, 'wg');
  ensureNum(req.calories_kcal_kg, 'ca');
  ensureEnum(req.route, 'rt', ['PO','NG','OG','NDT','gastrostomy','IV']);
  ensureStr(req.provider, 'pr');
  return { fe_id: `fng_${Date.now()}`, patient_id: req.patient_id, feed_type: req.feed_type, volume: req.volume_ml };
}
function kangaroo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.caregiver_id, 'ci');
  ensureNum(req.session_duration_min, 'sd');
  ensureNum(req.sessions_per_day, 'sp');
  ensureNum(req.skin_to_skin, 'ss');
  ensureNum(req.breastfeeding_count, 'bc');
  ensureBool(req.incubator_needed, 'in');
  ensureNum(req.temperature_stability, 'ts');
  ensureStr(req.provider, 'pr');
  return { kg_id: `kag_${Date.now()}`, patient_id: req.patient_id, sessions: req.sessions_per_day, duration: req.session_duration_min };
}
function screening(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.test_type, 'tt', ['newborn_hearing','NBS_metabolic','critical_CHD_pulse_ox','jaundice','ROP','hip_dysplasia','car seat','bloodspot','urine','other']);
  ensureEnum(req.result, 'rs', ['normal','abnormal','borderline','inconclusive','declined','pending','in_progress','refer']);
  ensureNum(req.day_of_life, 'dl');
  ensureNum(req.referral_count, 'rc');
  ensureStr(req.provider, 'pr');
  return { sc_id: `scr_${Date.now()}`, patient_id: req.patient_id, test_type: req.test_type, result: req.result };
}

function funcs() { return { apgar, bilimeter, feeding, kangaroo, screening }; }
module.exports = { funcs, ValidationError };
