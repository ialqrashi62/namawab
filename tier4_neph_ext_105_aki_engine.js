'use strict';
// TIER4_NEPH_EXT-105: AKI classification + etiology
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_AKI_2012', 'ADQI_AKI_2023'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function classify(req) {
  ensureNumber(req.creatinine_baseline, 'creatinine_baseline');
  ensureNumber(req.creatinine_peak, 'creatinine_peak');
  ensureNumber(req.urine_output_ml_kg_h, 'urine_output_ml_kg_h');
  ensureNumber(req.hours_anuria, 'hours_anuria');
  ensureBool(req.dialysis_initiated, 'dialysis_initiated');

  const ratio = req.creatinine_peak / Math.max(0.1, req.creatinine_baseline);
  let stage = 'no_aki';
  if (req.creatinine_peak >= 4 || req.dialysis_initiated) stage = 'stage_3';
  else if (ratio >= 3 || req.creatinine_peak >= 4 || req.hours_anuria >= 12) stage = 'stage_3';
  else if (ratio >= 2 || req.urine_output_ml_kg_h < 0.5) stage = 'stage_2';
  else if (ratio >= 1.5 || req.urine_output_ml_kg_h < 1) stage = 'stage_1';

  const staging_2012 = req.creatinine_peak >= req.creatinine_baseline + 0.3 || ratio >= 1.5;
  const staging_kdigo_2012 = staging_2012 ? stage : 'no_aki';
  return {
    creatinine_baseline: req.creatinine_baseline,
    creatinine_peak: req.creatinine_peak,
    ratio,
    urine_output_ml_kg_h: req.urine_output_ml_kg_h,
    stage: staging_kdigo_2012,
    dialysis_needed: stage === 'stage_3',
    citations: CITATIONS,
  };
}

function etiology(req) {
  ensureNumber(req.creatinine_baseline, 'creatinine_baseline');
  ensureNumber(req.creatinine_peak, 'creatinine_peak');
  ensureBool(req.dehydration, 'dehydration');
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.congestive_signs, 'congestive_signs');
  ensureNumber(req.fena, 'fena');
  ensureNumber(req.crcl_pre, 'crcl_pre');
  ensureBool(req.contrast, 'contrast');
  ensureBool(req.aminoglycoside, 'aminoglycoside');
  ensureBool(req.pe, 'pe');

  const prerenal = req.fena < 1 || req.dehydration || req.hypotension || req.pe;
  const intrinsic = req.fena > 2 || req.contrast || req.aminoglycoside;
  const postrenal = req.congestive_signs && req.fena >= 1 && req.fena <= 2;
  const etiology = prerenal && !intrinsic && !postrenal ? 'prerenal' :
    intrinsic && !prerenal ? 'intrinsic' :
    postrenal && !prerenal && !intrinsic ? 'postrenal' :
      'mixed_or_unclear';
  return {
    fena: req.fena,
    etiology,
    evaluation: prerenal ? 'volume_repletion_recheck_labs' :
      intrinsic ? 'urine_microscopy_serology_kidney_ultrasound' :
        postrenal ? 'bladder_scan_pelvic_imaging' : 'comprehensive_workup_with_nephrology',
    citations: CITATIONS,
  };
}

module.exports = { classify, etiology, CITATIONS, ValidationError };