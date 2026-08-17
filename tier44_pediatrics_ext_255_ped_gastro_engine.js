// filepath: tier44_pediatrics_ext_255_ped_gastro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gerd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'age_m');
  ensureStr(req.symptoms, 'sx');
  ensureEnum(req.weight_gain, 'wg', ['adequate','inadequate','poor']);
  ensureStr(req.trial_therapy, 'trial');
  ensureEnum(req.response, 'resp', ['none','partial','full']);
  ensureStr(req.next_step, 'next');
  return { response: req.response, next_step: req.next_step };
}
function constipation_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureNum(req.frequency_per_week, 'freq');
  ensureBool(req.soiling, 'soiling');
  ensureStr(req.abdominal_xray, 'xr');
  ensureStr(req.treatment, 'tx');
  return { frequency: req.frequency_per_week, treatment: req.treatment };
}
function celiac_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureStr(req.symptoms, 'sx');
  ensureStr(req.anti_ttg, 'ttg');
  ensureBool(req.biopsy_confirmed, 'bx');
  ensureStr(req.dietary_change, 'diet');
  ensureNum(req.follow_up, 'fu');
  return { biopsy_confirmed: req.biopsy_confirmed, diet: req.dietary_change };
}
function failure_to_thrive(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'age_m');
  ensureNum(req.weight_zscore, 'zscore');
  ensureEnum(req.caloric_intake, 'cal', ['adequate','inadequate','uncertain']);
  ensureEnum(req.workup, 'wk', ['pending','negative','positive_finding','incomplete']);
  ensureStr(req.intervention, 'int');
  return { zscore: req.weight_zscore, intervention: req.intervention };
}
function ibd_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.type, 'typ', ['crohns','ulcerative_colitis','indeterminate']);
  ensureStr(req.location, 'loc');
  ensureNum(req.pcDAI, 'pcdai');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['none','partial','improving','remission']);
  return { type: req.type, pcDAI: req.pcDAI };
}

function funcs() { return { gerd, constipation_ped, celiac_disease, failure_to_thrive, ibd_ped }; }
module.exports = { funcs, ValidationError };