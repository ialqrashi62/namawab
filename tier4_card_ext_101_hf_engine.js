'use strict';
// TIER4_CARD_EXT-101: Heart Failure HFrEF/HFpEF + GDMT
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACC_AHA_HF_2022', 'ESC_HF_2021'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function classify(req) {
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.nyha, 'nyha');
  ensureBool(req.symptoms, 'symptoms');
  ensureBool(req.dm, 'dm');
  ensureBool(req.htn, 'htn');
  ensureBool(req.cad, 'cad');

  let hf_type;
  if (req.lvef <= 40) hf_type = 'hfref';
  else if (req.lvef <= 49) hf_type = 'hfmrEf';
  else hf_type = 'hfpef';
  const stage = req.nyha >= 1 && req.nyha <= 4 ? `nyha_${Math.floor(req.nyha)}` : 'unknown';
  return {
    lvef: req.lvef,
    nyha: req.nyha,
    symptoms: req.symptoms,
    hf_type,
    stage,
    comorbidities: { dm: req.dm, htn: req.htn, cad: req.cad },
    citations: CITATIONS,
  };
}

function gdmt(req) {
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.potassium, 'potassium');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.hyperkalemia, 'hyperkalemia');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.bradycardia, 'bradycardia');
  ensureBool(req.afib, 'afib');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.copd, 'copd');

  const quadruple = req.lvef <= 40 && req.sbp >= 100 && req.egfr >= 30 && req.potassium >= 4 && req.potassium < 5.5;
  const pillars = {
    arni_or_acei_arb: req.sbp >= 100 && req.egfr >= 30 && !req.pregnant,
    beta_blocker: req.heart_rate >= 60 && req.lvef <= 40 && !req.bradycardia && !req.copd,
    mra: req.lvef <= 35 && req.egfr >= 30 && req.potassium < 5 && !req.hyperkalemia,
    sglt2: req.lvef <= 40 || req.diabetes,
  };
  return {
    lvef: req.lvef,
    quadruple_therapy_eligible: quadruple,
    pillars,
    ivabradine_addon: req.afib === false && req.heart_rate >= 70 && req.lvef <= 35,
    vericiguat_addon: !quadruple && req.egfr >= 15,
    citations: CITATIONS,
  };
}

module.exports = { classify, gdmt, CITATIONS, ValidationError };