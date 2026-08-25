'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { nccn_prostate: 'NCCN Guidelines Prostate Cancer 2020', eau_bladder: 'EAU Bladder Cancer Guidelines 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function prostateCancerRisk(input) {
  ensureObj(input, 'input');
  const psa = ensureNumber(input.psa, 'psa');
  const gleason_primary = ensureNumber(input.gleason_primary, 'gleason_primary');
  const gleason_secondary = ensureNumber(input.gleason_secondary, 'gleason_secondary');
  const stage = ensureEnum(input.stage, ['t1c','t2a','t2b','t2c','t3a','t3b','t4'], 'stage');
  const isup = gleason_primary + gleason_secondary;
  let risk;
  if (isup >= 8 || stage.startsWith('t3') || stage === 't4') { risk = 'high_metastatic_workup'; }
  else if (isup >= 7 || psa >= 10 || stage === 't2c') { risk = 'intermediate'; }
  else { risk = 'low'; }
  const therapy = risk === 'low' ? 'active_surveillance_or_radical_prostatectomy' : risk === 'intermediate' ? 'radical_prostatectomy_or_radiation_with_adt' : 'adt_combined_radiation_surgery';
  return { psa, gleason_primary, gleason_secondary, isup, stage, risk, therapy, citations:['nccn_prostate'] };
}

function bladderCancer(input) {
  ensureObj(input, 'input');
  const tumor_count = ensureNumber(input.tumor_count, 'tumor_count');
  const size_cm = ensureNumber(input.size_cm, 'size_cm');
  const cis = !!input.cis;
  const grade = ensureEnum(input.grade, ['low','high'], 'grade');
  const muscle_invasion = !!input.muscle_invasion;
  let stage;
  if (muscle_invasion) { stage = 'muscle_invasive_T2plus'; }
  else if (cis) { stage = 'T1_CIS'; }
  else { stage = 'Ta_T1'; }
  const therapy = muscle_invasion ? 'neoadjuvant_chemo_radical_cystectomy' : grade === 'high' ? 're_transurethral_resection_bcg' : 're_transurethral_resection_surveillance';
  return { tumor_count, size_cm, cis, grade, muscle_invasion, stage, therapy, citations:['eau_bladder'] };
}

module.exports = { prostateCancerRisk, bladderCancer, CITATIONS, ValidationError };
