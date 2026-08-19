// filepath: tier97_neph_glomerular_509_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function glomerulonephritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.proteinuria_g_day, 'prt');
  ensureNum(req.hematuria_rbc, 'hmd');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.complement_c3, 'c3');
  ensureNum(req.complement_c4, 'c4');
  ensureBool(req.anca_positive, 'ap');
  ensureEnum(req.diagnosis, 'dx', ['iga_nephropathy','membranous','fsgs','minimal_change','membranoproliferative','crescentic','lupus_nephritis','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function diabetic_nephropathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.hba1c, 'hba1c');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.urine_albumin, 'ua');
  ensureNum(req.blood_pressure, 'bp');
  ensureNum(req.disease_duration_years, 'ddy');
  ensureEnum(req.stage, 'st', ['normal','microalbuminuria','macroalbuminuria','ckd_stage_3','ckd_stage_4','ckd_stage_5','other','unknown','none']);
  ensureNum(req.progression_rate, 'pr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function polycystic_kidney(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.kidney_size_left, 'ksl');
  ensureNum(req.kidney_size_right, 'ksr');
  ensureNum(req.cyst_count, 'cc');
  ensureBool(req.family_history, 'fh');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.blood_pressure, 'bp');
  ensureBool(req.liver_cysts, 'lc');
  ensureNum(req.tolvaptan, 'tv');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function renal_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.donor_type, 'dt');
  ensureNum(req.months_post_transplant, 'mpt');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.tacrolimus_level, 'tl');
  ensureNum(req.rejection_episodes, 're');
  ensureEnum(req.immunosuppression, 'is', ['tacrolimus','cyclosporine','sirolimus','combination','other','unknown','none']);
  ensureNum(req.graft_function, 'gf');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function renal_stones(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.stone_type, 'st', ['calcium_oxalate','calcium_phosphate','struvite','uric_acid','cystine','mixed','other','unknown','none']);
  ensureNum(req.stone_size_mm, 'ss');
  ensureNum(req.stone_count, 'sc');
  ensureNum(req.hydration_status, 'hs');
  ensureNum(req.urine_calcium, 'uca');
  ensureNum(req.urine_oxalate, 'uo');
  ensureNum(req.urine_uric_acid, 'uua');
  ensureEnum(req.intervention, 'int', ['observation','lithotripsy','urs_pc_nl','surgery','medical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { glomerulonephritis, diabetic_nephropathy, polycystic_kidney, renal_transplant, renal_stones }; }
module.exports = { funcs, ValidationError };
