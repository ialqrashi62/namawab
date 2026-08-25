// filepath: tier56_surgical_specialties_315_surg_urology_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function prostatectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['open','laparoscopic','robotic_assisted','perineal']);
  ensureStr(req.indication, 'ind');
  ensureEnum(req.nerve_sparing, 'ns', ['bilateral','unilateral_right','unilateral_left','none']);
  ensureEnum(req.lymph_node_dissection, 'lnd', ['none','limited','standard','extended','super_extended']);
  ensureStr(req.pathology, 'path');
  ensureEnum(req.continence, 'cont', ['full_at_3_months','full_at_6_months','partial','incontinent']);
  return { approach: req.approach };
}
function nephrectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['open_partial','open_radical','laparoscopic_partial','laparoscopic_radical','robotic_partial','robotic_radical']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.warm_ischemia_min, 'wi');
  ensureEnum(req.margin, 'mg', ['negative','positive','close','unknown']);
  ensureStr(req.complications, 'comp');
  return { approach: req.approach };
}
function cystectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['open_radical','robotic_radical_with_intracorporeal_ileal_conduit','robotic_radical_with_extracorporeal_ileal_conduit','robotic_radical_with_neobladder']);
  ensureStr(req.indication, 'ind');
  ensureNum(req.lymph_node_count, 'lnc');
  ensureStr(req.complications, 'comp');
  return { approach: req.approach };
}
function ureteroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureEnum(req.approach, 'app', ['rigid','flexible','semi_rigid','combined']);
  ensureEnum(req.stone_clearance, 'sc', ['complete','fragmented_residual','planned_second_look','failed']);
  ensureEnum(req.stent_placed, 'sp', ['planned_removal_2_weeks','planned_removal_4_weeks','no_stent','planned_removal_6_weeks']);
  ensureStr(req.complications, 'comp');
  return { indication: req.indication };
}
function laser_prostate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.procedure, 'proc', ['holmium_laser_enucleation','thulium','greenlight','diode','bipolar','monopolar_turbp']);
  ensureNum(req.prostate_size_g, 'ps');
  ensureNum(req.tissue_enucleated_g, 'te');
  ensureNum(req.catheter_removal_days, 'cr');
  ensureStr(req.complications, 'comp');
  return { procedure: req.procedure };
}

function funcs() { return { prostatectomy, nephrectomy, cystectomy, ureteroscopy, laser_prostate }; }
module.exports = { funcs, ValidationError };