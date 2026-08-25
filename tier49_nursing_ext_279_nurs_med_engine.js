// filepath: tier49_nursing_ext_279_nurs_med_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function medication_administration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug, 'drug');
  ensureStr(req.route, 'route');
  ensureStr(req.site, 'site');
  ensureEnum(req.verification, 'ver', ['two_nurse_check','barcode_scanned','one_nurse_double_check']);
  ensureStr(req.administration_time, 'time');
  ensureEnum(req.reaction, 'rxn', ['none','mild','moderate','severe','anaphylaxis']);
  return { drug: req.drug, route: req.route };
}
function iv_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureNum(req.gauge, 'ga');
  ensureBool(req.patent, 'pat');
  ensureStr(req.dressing_change, 'dc');
  ensureNum(req.phlebitis_scale, 'ps');
  ensureBool(req.tissued, 'tis');
  return { site: req.site, gauge: req.gauge };
}
function blood_transfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.product, 'prod', ['prbc','platelets','plasma','cryo','whole_blood']);
  ensureNum(req.units, 'units');
  ensureStr(req.patient_identified, 'pi');
  ensureStr(req.pre_meds, 'pm');
  ensureEnum(req.vitals_pre, 'vp', ['stable','unstable','critical']);
  ensureEnum(req.vitals_15_min, 'v15', ['stable','unstable','reaction']);
  return { product: req.product, units: req.units };
}
function insulin_drip(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.current_rate_units_hr, 'rate');
  ensureNum(req.blood_glucose_mg_dl, 'bg');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.titration, 'tit');
  ensureNum(req.next_check_min, 'nc');
  return { rate: req.current_rate_units_hr, glucose: req.blood_glucose_mg_dl };
}
function heparin_drip(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.current_rate_units_hr, 'rate');
  ensureNum(req.aPTT_seconds, 'aptts');
  ensureNum(req.aPTT_ratio, 'aptt_r');
  ensureStr(req.protocol, 'prot');
  ensureStr(req.titration, 'tit');
  ensureNum(req.next_check_hours, 'nc');
  return { rate: req.current_rate_units_hr, aptt: req.aPTT_seconds };
}

function funcs() { return { medication_administration, iv_management, blood_transfusion, insulin_drip, heparin_drip }; }
module.exports = { funcs, ValidationError };