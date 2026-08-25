'use strict';
// TIER4_INFECT_EXT-106: Antimicrobial stewardship
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['IDSA_AMS_2016', 'CDC_Core_2019'];

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

function stewardship(req) {
  ensureStr(req.antibiotic, 'antibiotic');
  ensureStr(req.indication, 'indication');
  ensureStr(req.source, 'source');
  ensureNumber(req.start_day, 'start_day');
  ensureBool(req.culture_obtained, 'culture_obtained');
  ensureBool(req.micro_growth, 'micro_growth');
  ensureBool(req.allergy, 'allergy');
  ensureStr(req.route, 'route'); // iv | po
  ensureBool(req.oral_switch_eligible, 'oral_switch_eligible');

  const days_iv = req.route === 'iv' ? req.start_day : 0;
  const excessive_iv = req.oral_switch_eligible && req.route === 'iv' && req.start_day >= 3;
  const narrow_eligible = req.micro_growth === false && req.start_day >= 3;
  const recommendation = excessive_iv ? 'iv_to_po_switch' :
    narrow_eligible ? 'narrow_based_on_culture_or_discontinue' :
    req.allergy ? 'review_and_dose_adjust_per_allergy_profile' :
    'continue_current_therapy_with_daily_review';
  return {
    antibiotic: req.antibiotic,
    indication: req.indication,
    days_of_therapy: req.start_day,
    route: req.route,
    excessive_iv,
    narrow_eligible,
    recommendation,
    iv_to_po_eligible: req.oral_switch_eligible && req.route === 'iv' && req.start_day >= 3,
    citations: CITATIONS,
  };
}

function resistance(req) {
  ensureStr(req.organism, 'organism');
  ensureStr(req.resistance_pattern, 'resistance_pattern'); // none | mrsa | vre | esbl | cre | pseudomonas_aeruginosa | multi_drug_resistant
  ensureStr(req.site, 'site');
  ensureNumber(req.age, 'age');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.pregnant, 'pregnant');

  const mrsa_active = ['vancomycin', 'linezolid', 'daptomycin', 'ceftaroline'].includes(req.antibiotic || '');
  const vre_active = ['linezolid', 'daptomycin'].includes(req.antibiotic || '');
  const esbl_active = ['meropenem', 'imipenem', 'ertapenem'].includes(req.antibiotic || '');

  let regimen;
  if (req.resistance_pattern === 'mrsa') regimen = mrsa_active ? 'appropriate' : 'switch_to_vancomycin_or_linezolid';
  else if (req.resistance_pattern === 'vre') regimen = vre_active ? 'appropriate' : 'switch_to_linezolid_or_daptomycin';
  else if (req.resistance_pattern === 'esbl') regimen = esbl_active ? 'appropriate' : 'switch_to_carbapenem';
  else if (req.resistance_pattern === 'cre') regimen = 'ceftazidime_avibactam_or_meropenem_vaborbactam_with_id_consult';
  else if (req.resistance_pattern === 'pseudomonas_aeruginosa') regimen = 'anti_pseudomonal_beta_lactam_with_aminoglycoside_or_fluoroquinolone';
  else if (req.resistance_pattern === 'multi_drug_resistant') regimen = 'infectious_disease_consult_required';
  else regimen = 'narrow_spectrum_per_susceptibility';
  return {
    organism: req.organism,
    resistance_pattern: req.resistance_pattern,
    regimen,
    renal_adjustment: req.egfr < 30 ? 'renal_dose_adjustment_required' : 'standard_dose',
    citations: CITATIONS,
  };
}

module.exports = { stewardship, resistance, CITATIONS, ValidationError };