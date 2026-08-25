// filepath: tier31_nephrology_ext_191_nephro_ext_engine.js
// TIER31_NEPHROLOGY-191: Extended nephrology (GN, PKD, electrolytes, stones, HTN)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function glomerulonephritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.gn_type, 'gn', ['iga_nephropathy','membranous','fsgs','membranoproliferative','minimal_change','alport','lupus_nephritis','anca_vasculitis','post_infectious','other']);
  ensureNumber(req.proteinuria_g, 'prot');
  ensureNumber(req.creatinine, 'cr');
  ensureBool(req.biopsy_done, 'bx');
  ensureBool(req.raas_blockade, 'raas');
  ensureBool(req.steroid_indicated, 'steroid');
  let status;
  if (req.gn_type === 'anca_vasculitis' && req.creatinine > 4) status = 'severe_anca_aggressive_induction_plasmapheresis';
  else if (req.proteinuria_g >= 3.5 && !req.biopsy_done) status = 'nephrotic_biopsy_refer';
  else if (!req.raas_blockade) status = 'add_raas_blockade_proteinuria';
  else if (req.steroid_indicated && req.gn_type === 'minimal_change') status = 'steroid_initiate_minimal_change';
  else status = 'gn_appropriate_management';
  return { status, gn: req.gn_type };
}

function polycystic_kidney(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.kidney_count, 'kcount');
  ensureNumber(req.kidney_size_cm, 'ksize');
  ensureBool(req.fhx_polycystic, 'fhx');
  ensureBool(req.cyst_infection, 'cyst_inf');
  ensureBool(req.tolvaptan_prescribed, 'tolvaptan');
  let status;
  if (req.cyst_infection) status = 'cyst_infection_antibiotics_review';
  else if (req.kidney_size_cm >= 18 && req.tolvaptan_prescribed) status = 'tolvaptan_continue_cyst_growth_slowing';
  else if (req.kidney_size_cm >= 18 && !req.tolvaptan_prescribed) status = 'large_polycystic_consider_tolvaptan';
  else if (req.fhx_polycystic && req.kidney_count === 2) status = 'adpkd_followed_monitor';
  else status = 'polycystic_kidney_review';
  return { status, ksize: req.kidney_size_cm };
}

function electrolyte_acid_base(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.sodium, 'na');
  ensureNumber(req.potassium, 'k');
  ensureNumber(req.bicarbonate, 'hco3');
  ensureNumber(req.anion_gap, 'ag');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.acute, 'acute');
  let status;
  if (req.potassium >= 6.5) status = 'severe_hyperkalemia_emergency';
  else if (req.potassium < 2.5) status = 'severe_hypokalemia_iv_replace';
  else if (req.bicarbonate < 12) status = 'severe_metabolic_acidosis_evaluate';
  else if (req.sodium < 120) status = 'severe_hyponatremia_review_siadh';
  else if (req.sodium > 160) status = 'severe_hypernatremia_review_fluid';
  else status = 'electrolyte_appropriate';
  return { status, k: req.potassium };
}

function stone_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stone_type, 'stone', ['calcium_oxalate','calcium_phosphate','uric_acid','struvite','cystine','mixed','other']);
  ensureEnum(req.recurrence, 'rec', ['yes','no','first','unknown']);
  ensureEnum(req.urine_24, 'urine24', ['hypercalciuria','hyperoxaluria','hyperuricosuria','hypocitraturia','normal','mixed','other']);
  ensureBool(req.hydration_adequate, 'hydra');
  ensureBool(req.thiazide_prescribed, 'thiazide');
  let status;
  if (req.recurrence === 'yes' && !req.hydration_adequate) status = 'recurrent_stone_increase_hydration';
  else if (req.urine_24 === 'hypercalciuria' && !req.thiazide_prescribed) status = 'hypercalciuria_thiazide_consider';
  else if (req.recurrence === 'first' && req.hydration_adequate) status = 'first_stone_hydration_monitor';
  else status = 'stone_clinic_appropriate';
  return { status, st: req.stone_type };
}

function hypertensive_renal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.bp_systolic, 'sbp');
  ensureNumber(req.bp_diastolic, 'dbp');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.proteinuria_mg, 'prot');
  ensureEnum(req.raas_blockade, 'raas', ['ace_inhibitor','arb','none','combination','other']);
  ensureBool(req.secondary_cause_screened, 'sec');
  let status;
  if (req.bp_systolic >= 180 || req.bp_diastolic >= 120) status = 'hypertensive_emergency_iv_treatment';
  else if (req.bp_systolic >= 160 && req.raas_blockade === 'none') status = 'add_raas_blockade_htn_renal';
  else if (!req.secondary_cause_screened && req.bp_systolic < 140) status = 'resistant_htn_secondary_screen';
  else if (req.bp_systolic >= 140) status = 'htn_above_goal_titrate_treatment';
  else status = 'htn_renal_appropriate';
  return { status, sbp: req.bp_systolic };
}

function funcs() { return { glomerulonephritis, polycystic_kidney, electrolyte_acid_base, stone_clinic, hypertensive_renal }; }
module.exports = { funcs, ValidationError };