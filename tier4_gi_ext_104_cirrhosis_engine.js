'use strict';
// TIER4_GI_EXT-104: Cirrhosis - MELD + decompensation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AASLD_Cirrhosis_2020', 'EASL_Cirrhosis_2018'];

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

function meld(req) {
  ensureNumber(req.bilirubin, 'bilirubin');
  ensureNumber(req.inr, 'inr');
  ensureNumber(req.creatinine, 'creatinine');
  ensureBool(req.dialysis, 'dialysis');

  const bili = Math.max(1, req.bilirubin);
  const inr = Math.max(1, req.inr);
  const cr = req.dialysis ? 4 : Math.max(1, req.creatinine);
  const meld = Math.round((3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43) * 10) / 10;
  const three_month_mortality = meld >= 40 ? '71' : meld >= 30 ? '52' : meld >= 20 ? '20' : meld >= 10 ? '6' : '<2';
  return {
    bilirubin: req.bilirubin,
    inr: req.inr,
    creatinine: req.creatinine,
    meld,
    three_month_mortality_pct: three_month_mortality,
    transplant_indicated: meld >= 15 || req.dialysis,
    citations: CITATIONS,
  };
}

function decompensation(req) {
  ensureBool(req.ascites, 'ascites');
  ensureBool(req.hepatic_encephalopathy, 'hepatic_encephalopathy');
  ensureBool(req.variceal_bleeding, 'variceal_bleeding');
  ensureBool(req.spontaneous_bacterial_peritonitis, 'spontaneous_bacterial_peritonitis');
  ensureBool(req.hepatorenal_syndrome, 'hepatorenal_syndrome');

  const decompensation = req.ascites || req.hepatic_encephalopathy || req.variceal_bleeding || req.spontaneous_bacterial_peritonitis || req.hepatorenal_syndrome;
  const west_haven = req.hepatic_encephalopathy ? 'unknown' : 'none';
  const child_pugh_score = (req.ascites ? 1 : 0) + (req.hepatic_encephalopathy ? 1 : 0);
  return {
    decompensation,
    ascites: req.ascites,
    encephalopathy: req.hepatic_encephalopathy,
    variceal_bleeding: req.variceal_bleeding,
    sbp: req.spontaneous_bacterial_peritonitis,
    hrs: req.hepatorenal_syndrome,
    child_pugh_score_partial: child_pugh_score,
    next: req.spontaneous_bacterial_peritonitis ? 'diagnostic_paracentesis' :
      req.variceal_bleeding ? 'urgent_gi_endoscopy_with_band_ligation_or_glue' :
        req.hepatorenal_syndrome ? 'vasoconstrictor_plus_albumin_or_terlipressin' :
          req.ascites ? 'diuretics_spironolactone_furosemide_evaluate_transplant' :
            'continue_surveillance',
    citations: CITATIONS,
  };
}

module.exports = { meld, decompensation, CITATIONS, ValidationError };