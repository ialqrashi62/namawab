// filepath: tier5_sdoh_ext_103_socio_engine.js
// TIER5_SDOH_EXT-103: Socioeconomic (income, insurance, citizenship, debt, financial)
'use strict';

const CITATIONS = [
  'CDC_PRAPARE_Finance',
  'AHRQ_Financial_Safety',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function insurance(req) {
  ensureStr(req.coverage, 'coverage');
  ensureEnum(req.coverage, 'coverage', ['employer_private','marketplace','medicare','medicaid','dual_eligible','tricare','self_pay_uninsured','unidentified']);
  ensureBool(req.underinsured_for_ded, 'underinsured_for_ded');
  ensureNumber(req.annual_deductible_in_cents, 'annual_deductible_in_cents');
  ensureNumber(req.annual_oop_max_in_cents, 'annual_oop_max_in_cents');
  if (req.annual_deductible_in_cents < 0 || req.annual_oop_max_in_cents < 0) throw new ValidationError('cents must be positive');

  let plan;
  if (req.coverage === 'self_pay_uninsured') plan = 'refer_to_marketplace_or_safety_net_then_patient_navigator_assist';
  else if (req.underinsured_for_ded && req.annual_deductible_in_cents / 100 >= 5000) plan = 'consider_deductible_funding_program_or_subsidy_enrollment';
  else if (req.coverage === 'unidentified') plan = 'patient_navigator_for_coverage_assessment';
  else plan = 'standard_covered_care';
  if (req.annual_oop_max_in_cents / 100 >= req.annual_deductible_in_cents / 100 * 3) plan += '_hardship_evaluation_required';
  return { plan, coverage: req.coverage };
}

function income(req) {
  ensureNumber(req.household_income_in_cents_yearly, 'household_income_in_cents_yearly');
  ensureNumber(req.household_size, 'household_size');
  ensureStr(req.country, 'country');
  ensureEnum(req.country, 'country', ['us','eu','ksa','gcc','global_low_income']);

  let threshold;
  if (req.country === 'us') threshold = 1500000 * req.household_size;
  else if (req.country === 'eu') threshold = 1100000 * req.household_size;
  else if (['ksa','gcc'].includes(req.country)) threshold = 900000 * req.household_size;
  else threshold = 500000 * req.household_size;

  const ratio = req.household_income_in_cents_yearly / threshold;
  let fpl_band;
  if (ratio >= 4) fpl_band = '>=400_percent_fpl_not_eligible_for_low_income_subsidies';
  else if (ratio >= 2) fpl_band = '200_399_percent_fpl_subsidies_possible_with_above_2x_fpl_premium';
  else if (ratio >= 1) fpl_band = '100_199_percent_fpl_subsidies_eligible';
  else if (ratio >= 0.5) fpl_band = '50_99_percent_fpl_subsidies_highly_eligible';
  else fpl_band = 'less_than_50_percent_fpl_medicaid_or_higher_eligible';

  return { ratio: Math.round(ratio * 100) / 100, fpl_band };
}

function debt(req) {
  ensureNumber(req.medical_debt_in_cents, 'medical_debt_in_cents');
  ensureNumber(req.outstanding_balance_in_cents, 'outstanding_balance_in_cents');
  ensureBool(req.collection_action, 'collection_action');
  ensureStr(req.bankruptcy_filed, 'bankruptcy_filed');
  ensureEnum(req.bankruptcy_filed, 'bankruptcy_filed', ['no','yes_in_progress','yes_completed_within_5yrs']);

  let plan;
  if (req.collection_action) plan = 'refer_to_health_care_financial_counselor_for_medical_debt_relief_now';
  else if (req.medical_debt_in_cents / 100 >= 5000) plan = 'consider_hardship_application_payment_plan';
  else if (req.bankruptcy_filed !== 'no') plan = 'check_with_medical_economics_for_partial_finance_program_assist';
  else plan = 'standard_payment_plan_offered';
  return { plan };
}

function citizenship(req) {
  ensureStr(req.status, 'status');
  ensureEnum(req.status, 'status', ['citizen_native','permanent_resident','refugee','asylum','visitor','temporary_work_visa','student_visa','undocumented','unidentified']);
  ensureBool(req.eligible_for_public_coverage, 'eligible_for_public_coverage');
  ensureNumber(req.years_in_country, 'years_in_country');

  let plan;
  if (req.status === 'asylum' || req.status === 'refugee') plan = 'review_public_charge_then_enroll_in_public_insurance';
  else if (req.status === 'undocumented') plan = 'review_safety_net_programs_or_community_clinics_then_lookout';
  else if (['student_visa', 'temporary_work_visa', 'visitor'].includes(req.status)) plan = 'consider_international_insurance_or_visitor_navigator';
  else if (req.status === 'unidentified') plan = 'patient_navigator_for_status_assessment';
  else plan = 'continue_with_coverage_assessment';
  if (req.years_in_country <= 1 && req.eligible_for_public_coverage === false) plan += '_complex_humanitarian_specialist_consult';
  return { plan, status: req.status };
}

function financial_counseling(req) {
  ensureNumber(req.coverage_gap_in_cents_yearly, 'coverage_gap_in_cents_yearly');
  ensureBool(req.coverage_status_described, 'coverage_status_described');
  ensureBool(req.patient_has_finance_capacity, 'patient_has_finance_capacity');
  ensureNumber(req.days_treatment_planned, 'days_treatment_planned');

  let action;
  if (!req.coverage_status_described) action = 'first_describe_coverage_then_finance_counselor_or_patient_navigator';
  else if (req.coverage_gap_in_cents_yearly / 100 >= 5000) action = 'high_priority_financial_counselor_to_create_payment_plan_with_subsidy_application';
  else if (req.days_treatment_planned >= 30 && req.coverage_gap_in_cents_yearly / 100 >= 1000) action = 'financial_counselor_with_payment_plan_options';
  else if (!req.patient_has_finance_capacity) action = 'consider_safety_net_clinic_referral_or_charity_program';
  else action = 'supportive_payment_plan_and_program_enrollment';

  return { coverage_gap_in_cents_yearly: req.coverage_gap_in_cents_yearly, action };
}

function funcs() { return { insurance, income, debt, citizenship, financial_counseling }; }
module.exports = { funcs, CITATIONS, ValidationError };
