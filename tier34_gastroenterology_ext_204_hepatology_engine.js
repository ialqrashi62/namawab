// filepath: tier34_gastroenterology_ext_204_hepatology_engine.js
// TIER34_GASTROENTEROLOGY-204: Hepatology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function liver_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.ast, 'ast');
  ensureNumber(req.alt, 'alt');
  ensureNumber(req.alp, 'alp');
  ensureNumber(req.total_bilirubin, 'tbili');
  ensureNumber(req.albumin, 'alb');
  ensureEnum(req.pattern, 'pat', ['hepatocellular','cholestatic','mixed','normal','other']);
  let status;
  if (req.albumin < 2.5 && req.total_bilirubin > 5) status = 'acute_liver_failure_urgent';
  else if (req.ast > 1000) status = 'massive_transaminitis_acute_liver_injury';
  else if (req.pattern === 'hepatocellular' && req.ast > 5 * 40) status = 'hepatocellular_pattern_investigate';
  else if (req.pattern === 'cholestatic' && req.alp > 2 * 120) status = 'cholestatic_pattern_imaging_review';
  else status = 'liver_function_review';
  return { status, pat: req.pattern };
}

function hepatitis_b(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.hbsag, 'hbs', ['positive','negative','not_done']);
  ensureEnum(req.hbeag, 'hbe', ['positive','negative','not_done']);
  ensureNumber(req.hbv_dna_iu_ml, 'dna');
  ensureNumber(req.alt, 'alt');
  ensureEnum(req.phase, 'phase', ['immune_tolerant','immune_active_hbe_positive','immune_active_hbe_negative','immune_inactive','resolved','acute','chronic','other']);
  ensureBool(req.treatment_needed, 'tx');
  let status;
  if (req.phase === 'immune_active_hbe_positive' && !req.treatment_needed) status = 'immune_active_treatment_indicated_review';
  else if (req.phase === 'immune_inactive' && req.treatment_needed) status = 'inactive_carrier_discontinue_review';
  else if (req.hbsag === 'positive' && req.phase === 'resolved') status = 'occult_hbv_monitor';
  else if (req.phase === 'immune_active_hbe_negative' && req.hbv_dna_iu_ml >= 2000) status = 'hbv_treatment_initiate';
  else status = 'hbv_review';
  return { status, ph: req.phase };
}

function hepatitis_c(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.hcv_ab, 'ab', ['positive','negative','not_done']);
  ensureEnum(req.hcv_rna, 'rna', ['positive','negative','not_done','detectable','undetectable']);
  ensureNumber(req.genotype, 'gen');
  ensureNumber(req.viral_load_iu_ml, 'vl');
  ensureEnum(req.fibrosis_stage, 'fib', ['f0','f1','f2','f3','f4','cirrhosis','unknown','other']);
  ensureBool(req.treatment_eligible, 'eligible');
  let status;
  if (req.hcv_rna.includes('positive') && !req.treatment_eligible) status = 'hcv_treatment_indicated_daa';
  else if (req.fibrosis_stage === 'f4' && !req.treatment_eligible) status = 'cirrhosis_hcc_surveillance_treatment';
  else if (req.hcv_rna === 'undetectable' && req.hcv_ab === 'positive') status = 'spontaneous_clearance_maintain';
  else if (req.treatment_eligible && req.fibrosis_stage !== 'cirrhosis') status = 'treatment_eligible_initiate_daa';
  else status = 'hcv_review_appropriate';
  return { status, fib: req.fibrosis_stage };
}

function nafld_mash(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.bmi, 'bmi');
  ensureNumber(req.alt, 'alt');
  ensureNumber(req.ast, 'ast');
  ensureNumber(req.fibroscan_kpa, 'kpa');
  ensureNumber(req.cap_score, 'cap');
  ensureEnum(req.steatosis_grade, 'st', ['none','mild','moderate','severe','other']);
  ensureEnum(req.fibrosis, 'fib', ['f0','f1','f2','f3','f4','unknown','other']);
  let status;
  if (req.fibrosis === 'f4') status = 'mash_cirrhosis_hcc_surveillance';
  else if (req.fibrosis === 'f3' && req.steatosis_grade === 'severe') status = 'advanced_fibrosis_resmetirom_consider';
  else if (req.fibrosis === 'f2' && req.bmi >= 35) status = 'significant_fibrosis_bariatric_refer';
  else if (req.fibrosis === 'f0' || req.fibrosis === 'f1') status = 'mild_fibrosis_lifestyle_intervention';
  else status = 'nafld_review';
  return { status, fib: req.fibrosis };
}

function liver_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.meld, 'meld');
  ensureEnum(req.indication, 'ind', ['decompensated_cirrhosis','acute_liver_failure','hepatocellular_carcinoma','primary_graft_dysfunction','other']);
  ensureBool(req.evaluated, 'eval');
  ensureBool(req.listed, 'listed');
  ensureNumber(req.waiting_time_months, 'wait');
  let status;
  if (req.meld >= 30 && !req.listed) status = 'meld_high_urgent_listing';
  else if (req.meld >= 15 && !req.evaluated) status = 'meld_moderate_transplant_evaluation';
  else if (req.meld < 15) status = 'meld_low_active_surveillance';
  else if (req.listed && req.waiting_time_months > 12) status = 'long_wait_review_status';
  else status = 'liver_transplant_review';
  return { status, meld: req.meld };
}

function funcs() { return { liver_function, hepatitis_b, hepatitis_c, nafld_mash, liver_transplant }; }
module.exports = { funcs, ValidationError };