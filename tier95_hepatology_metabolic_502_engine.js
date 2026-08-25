// filepath: tier95_hepatology_metabolic_502_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nafld_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.alt, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.fibroscan_kpa, 'fk');
  ensureNum(req.nafld_score, 'nfs');
  ensureBool(req.ultrasound_fatty, 'uf');
  ensureBool(req.metabolic_syndrome, 'ms');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function nash_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.weight_loss_pct, 'wlp');
  ensureNum(req.alt_improvement, 'ai');
  ensureBool(req.diabetes_control, 'dc');
  ensureBool(req.vitamin_e, 've');
  ensureBool(req.liraglutide, 'lir');
  ensureBool(req.alcohol_use, 'au');
  ensureNum(req.nafld_resolution, 'nfr');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function wilson_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ceruloplasmin, 'cp');
  ensureNum(req.urinary_copper_24h, 'uc');
  ensureBool(req.kayser_fleischer_rings, 'kfr');
  ensureBool(req.neurological, 'neu');
  ensureBool(req.penicillamine, 'pen');
  ensureBool(req.zinc, 'zn');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hemochromatosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ferritin, 'fer');
  ensureNum(req.tsat, 'tsat');
  ensureEnum(req.hfe_c282y, 'c282y', ['homozygous','heterozygous','negative','pending','other','unknown']);
  ensureNum(req.liver_biopsy_iron, 'lbi');
  ensureBool(req.phlebotomy, 'phleb');
  ensureNum(req.frequency_weeks, 'fw');
  ensureBool(req.cardiac_involvement, 'ci');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function autoimmune_hepatitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.ana, 'ana', ['positive','negative','pending','other','unknown']);
  ensureEnum(req.anti_sma, 'asma', ['positive','negative','pending','other','unknown']);
  ensureEnum(req.lkm1, 'lkm1', ['positive','negative','pending','other','unknown']);
  ensureNum(req.iga_level, 'iga');
  ensureEnum(req.liver_biopsy, 'lb', ['interface_hepatitis','plasma_cells','rosettes','fibrosis','normal','other','unknown','none']);
  ensureBool(req.prednisone, 'pdn');
  ensureBool(req.azathioprine, 'aza');
  ensureEnum(req.response, 'res', ['remission','stable','active','failed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { nafld_assessment, nash_treatment, wilson_disease, hemochromatosis, autoimmune_hepatitis }; }
module.exports = { funcs, ValidationError };
