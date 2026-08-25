'use strict';
// TIER4_GENETIC-104 Carrier Screening
const CITATIONS = ['ACOG_Carrier_Screening','ACMG_Carrier_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function expandedCarrierScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const ethnicity = ensureEnum(input.ethnicity || 'general', ['general','ashkenazi_jewish','cajun','french_canadian','mediterranean','southeast_asian','hispanic','african','east_asian'], 'ethnicity');
  const test_panel = ensureEnum(input.test_panel || 'standard', ['standard','expanded','ashkenazi_panel'], 'test_panel');
  let recommended = false;
  if (test_panel === 'expanded') recommended = true;
  if (test_panel === 'ashkenazi_panel' && ethnicity === 'ashkenazi_jewish') recommended = true;
  if (test_panel === 'standard' && ethnicity !== 'general') recommended = true;
  const core_conditions = ['cystic_fibrosis','spinal_muscular_atrophy','fragile_x'];
  return { ethnicity, test_panel, recommended, core_conditions, citations: CITATIONS };
}

function carrierRiskCounseling(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const carrier_status = ensureEnum(input.carrier_status || 'negative', ['negative','carrier','affected','unknown'], 'carrier_status');
  const partner_carrier = ensureEnum(input.partner_carrier || 'unknown', ['negative','carrier','affected','unknown'], 'partner_carrier');
  const condition = ensureEnum(input.condition || 'cystic_fibrosis', ['cystic_fibrosis','sickle_cell','tay_sachs','thalassemia','spinal_muscular_atrophy','fragile_x','pompe'], 'condition');
  let offspring_risk = 'minimal';
  if (carrier_status === 'carrier' && partner_carrier === 'carrier') offspring_risk = '25_percent_affected_50_percent_carrier';
  else if (carrier_status === 'carrier' || partner_carrier === 'carrier') offspring_risk = '50_percent_carrier';
  else if (carrier_status === 'affected' || partner_carrier === 'affected') offspring_risk = 'high_affected_or_carrier';
  return { carrier_status, partner_carrier, condition, offspring_risk, recommendations: offspring_risk !== 'minimal' ? ['prenatal_testing','preimplantation_genetic_testing_if_ivf'] : ['standard_reproductive_planning'], citations: CITATIONS };
}

module.exports = { expandedCarrierScreen, carrierRiskCounseling, CITATIONS, ValidationError };