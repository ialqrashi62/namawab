// filepath: tier143_ob_681_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pregnancy_register(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.lmp, 'lm');
  ensureNum(req.ega_weeks, 'eg');
  ensureNum(req.gravida, 'gr');
  ensureNum(req.para, 'pa');
  ensureNum(req.miscarriages, 'mi');
  ensureEnum(req.risk, 'rs', ['low','moderate','high','very_high']);
  ensureNum(req.bmi, 'bm');
  ensureStr(req.booking_provider, 'bp');
  return { pr_id: `pr_${Date.now()}`, patient_id: req.patient_id, ega: req.ega_weeks, risk: req.risk };
}
function antenatal_visit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pregnancy_id, 'pi');
  ensureNum(req.ega_weeks, 'eg');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.fetal_heart_rate, 'fh');
  ensureStr(req.fundal_height, 'fd');
  ensureNum(req.symptoms_score, 'ss');
  ensureStr(req.provider, 'pr');
  return { av_id: `av_${Date.now()}`, pregnancy_id: req.pregnancy_id, ega: req.ega_weeks, fhr: req.fetal_heart_rate };
}
function ultrasound(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pregnancy_id, 'p2');
  ensureEnum(req.type, 'tp', ['dating','nuchal','anomaly','growth','biophysical','Doppler','3D_4D','targeted','reassurance','other']);
  ensureNum(req.ega_weeks, 'eg');
  ensureNum(req.fetal_weight_g, 'fw');
  ensureNum(req.afi, 'af');
  ensureEnum(req.placenta, 'pl', ['anterior','posterior','fundal','low_lying','previa','marginal','unknown']);
  ensureNum(req.cervical_length, 'cl');
  ensureStr(req.provider, 'pr');
  return { us_id: `us_${Date.now()}`, pregnancy_id: req.pregnancy_id, type: req.type, ega: req.ega_weeks };
}
function delivery(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pregnancy_id, 'p3');
  ensureEnum(req.mode, 'mo', ['vaginal','instrumental','VBAC','cesarean_elective','cesarean_emergency','cesarean_intrapartum','water','homebirth']);
  ensureNum(req.labor_hours, 'lh');
  ensureEnum(req.perineal, 'pe', ['intact','1st_degree','2nd_degree','3rd_degree','4th_degree','episiotomy','laceration']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.apgar_1, 'a1');
  ensureNum(req.apgar_5, 'a5');
  ensureNum(req.birth_weight_g, 'bw');
  ensureStr(req.provider, 'pr');
  return { de_id: `de_${Date.now()}`, pregnancy_id: req.pregnancy_id, mode: req.mode, apgar_5: req.apgar_5 };
}
function postpartum(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.delivery_id, 'di');
  ensureNum(req.days_post_delivery, 'dp');
  ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.lochia, 'lo');
  ensureNum(req.involution, 'in');
  ensureEnum(req.mood, 'md', ['baby_blues','normal','anxiety','depression','psychosis','other']);
  ensureNum(req.bonding_score, 'bd2');
  ensureStr(req.provider, 'pr');
  return { pp_id: `pp_${Date.now()}`, delivery_id: req.delivery_id, days: req.days_post_delivery, mood: req.mood };
}

function funcs() { return { pregnancy_register, antenatal_visit, ultrasound, delivery, postpartum }; }
module.exports = { funcs, ValidationError };
