// filepath: tier103_nuclear_medicine_540_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pet_ct(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.tracer, 'tr', ['fdg','psma','dotatate','fapi','fluciclovine','other','unknown']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.suv_max, 'suv');
  ensureStr(req.findings, 'fd');
  ensureEnum(req.stage, 'st', ['0','I','II','III','IV','recurrence','no_disease','unknown','other','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function bone_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.tracer, 'tr', ['methylene_diphosphonate','hmpao','other','unknown']);
  ensureStr(req.indication, 'ind');
  ensureEnum(req.findings, 'fd', ['normal','metastases','fracture','infection','arthritis','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function thyroid_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.tracer, 'tr', ['i123','i131','tc99m','other','unknown']);
  ensureEnum(req.uptake_pattern, 'up', ['homogeneous','heterogeneous','cold_nodule','hot_nodule','decreased','other','unknown','none']);
  ensureNum(req.tsh, 'tsh');
  ensureEnum(req.diagnosis, 'dx', ['hyperthyroidism','thyroiditis','goiter','nodule','cancer','normal','other','unknown','none']);
  ensureEnum(req.treatment, 'tx', ['observation','medication','rai','surgery','combination','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function myocardial_perfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.stress, 'st', ['exercise','pharmacologic','none','other','unknown']);
  ensureEnum(req.rest, 'rt', ['normal','abnormal','ischemia','scar','other','unknown']);
  ensureBool(req.reversibility, 'rev');
  ensureNum(req.ef, 'ef');
  ensureStr(req.perfusion_defect, 'pd');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function therapy_radionuclide(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.therapy_id, 'tid');
  ensureEnum(req.isotope, 'is', ['i131','lu177_dotatate','lu177_psma','sm153','sr89','y90','other','unknown']);
  ensureNum(req.dose_mci, 'dm');
  ensureStr(req.indication, 'ind');
  ensureNum(req.side_effects, 'se');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  return { tid: req.therapy_id };
}

function funcs() { return { pet_ct, bone_scan, thyroid_scan, myocardial_perfusion, therapy_radionuclide }; }
module.exports = { funcs, ValidationError };
