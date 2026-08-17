// filepath: tier44_pediatrics_ext_256_ped_endo_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function type1_diabetes_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureNum(req.hba1c, 'a1c');
  ensureStr(req.insulin_regimen, 'ins');
  ensureBool(req.cgm, 'cgm');
  ensureNum(req.hypoglycemic_episodes_per_week, 'hypo');
  ensureNum(req.follow_up, 'fu');
  return { a1c: req.hba1c, regimen: req.insulin_regimen };
}
function growth_hormone_deficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureNum(req.height_zscore, 'hz');
  ensureNum(req.gh_stimulation_peak, 'gh');
  ensureStr(req.bone_age, 'ba');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['improving','stable','poor']);
  return { height_z: req.height_zscore, gh_peak: req.gh_stimulation_peak };
}
function puberty_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.sex, 'sex', ['male','female','ambiguous']);
  ensureEnum(req.type, 'typ', ['precocious','delayed','advanced','absent']);
  ensureStr(req.bone_age, 'ba');
  ensureNum(req.lh_peak, 'lh');
  ensureStr(req.intervention, 'int');
  return { type: req.type, intervention: req.intervention };
}
function congenital_adrenal_hyp(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_days, 'age_d');
  ensureEnum(req.form, 'form', ['classic_salt_wasting','classic_simple_virilizing','non_classic']);
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req['17_ohp'], 'ohp');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.status, 'stat', ['stable','unstable','critical']);
  return { form: req.form, status: req.status };
}
function thyroid_ped(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.condition, 'cond', ['congenital_hypothyroidism','hypothyroidism_acquired','hyperthyroidism_graves','hashimotos','thyroid_nodule']);
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.t4_free, 't4');
  ensureStr(req.etiology, 'eti');
  ensureStr(req.treatment, 'tx');
  return { condition: req.condition, tsh: req.tsh };
}

function funcs() { return { type1_diabetes_ped, growth_hormone_deficiency, puberty_disorder, congenital_adrenal_hyp, thyroid_ped }; }
module.exports = { funcs, ValidationError };