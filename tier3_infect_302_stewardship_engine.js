/**
 * TIER3_INFECT-302 Antimicrobial Stewardship Engine
 * De-escalation review + IV-to-PO conversion + restricted abx approval + culture-directed therapy + DDD tracking + OPAT
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CDC_CORE: 'CDC Core Elements 2024', IDSA_ASP: 'IDSA ASP 2024' };

function deEscalationReview(input) {
  const { day_on_antibiotic, cultures_drawn, cultures_positive, current_regimen, clinical_improvement, suspected_organism } = input;
  let recommendation = 'continue_current';
  if (day_on_antibiotic >= 3 && cultures_positive && cultures_positive !== 'negative') recommendation = 'narrow_to_culture_directed';
  else if (day_on_antibiotic >= 3 && cultures_positive === 'negative' && clinical_improvement) recommendation = 'consider_discontinuation';
  else if (day_on_antibiotic >= 7 && !clinical_improvement) recommendation = 'evaluate_source_control_and_reassess';
  return {
    recommendation,
    narrow_target: cultures_positive && cultures_positive !== 'negative' ? 'tailor_to_pathogen_and_susceptibility' : 'consider_discontinuation',
    current_regimen, day_on_antibiotic,
    citation: CITATIONS.IDSA_ASP,
  };
}

function ivToPoConversion(input) {
  const { drug, on_iv, can_tolerate_po, afebrile, eating_well, indication } = input;
  const candidates = ['metronidazole', 'fluoroquinolones', 'linezolid', 'TMP_SMX', 'clindamycin', 'voriconazole', 'fluconazole', 'valacyclovir'];
  const eligible = on_iv && can_tolerate_po && afebrile && eating_well && candidates.includes(drug);
  return {
    eligible_iv_to_po: eligible,
    po_equivalent_dose: drug === 'metronidazole' ? '500mg_PO_TID' : drug === 'ciprofloxacin' ? '500mg_PO_BID' : drug === 'linezolid' ? '600mg_PO_BID' : drug === 'fluconazole' ? '400mg_PO_daily' : 'consult_pharmacy',
    expected_length_of_stay_reduction_days: eligible ? 2 : 0,
    citation: CITATIONS.IDSA_ASP,
  };
}

function restrictedAntibioticApproval(input) {
  const { drug, indication, indication_classification, prior_approval_expiry_hours, on_antibiotic } = input;
  const restricted = ['vancomycin', 'linezolid', 'daptomycin', 'meropenem', 'cefepime', 'ceftaroline', 'polymyxin_B', 'colistin', 'fidaxomicin', 'micafungin'];
  const tier = restricted.includes(drug) ? 'restricted' : 'unrestricted';
  return {
    drug,
    tier,
    approval_required: tier === 'restricted' && !input.prior_approval,
    approval_validity_hours: 72,
    documented_indication_acceptable: ['bacterial_infection_culture_directed', 'healthcare_associated_infection', 'empiric_severe_infection', 'mdro_colonization'].includes(indication_classification),
    next_review_hours: prior_approval_expiry_hours || 72,
  };
}

function cultureDirectedTherapy(input) {
  const { organism, susceptibility, antibiotic_chosen, indication } = input;
  const is_susceptible = susceptibility && susceptibility[antibiotic_chosen] === 'susceptible';
  const resistance_genes = ['ESBL', 'MRSA', 'VRE', 'CRE', 'CPE', 'Pseudomonas_MDR', 'Acinetobacter_MDR'];
  return {
    organism, antibiotic_chosen,
    susceptible: is_susceptible,
    de_escalation_target: is_susceptible ? 'narrow_if_possible' : 'broaden_based_on_resistance_pattern',
    resistance_pattern: resistance_genes.filter(g => susceptibility && susceptibility[g] === 'positive'),
    citation: CITATIONS.IDSA_ASP,
  };
}

function dddTracking(input) {
  const { drug, total_grams_used, patient_days, period_months } = input;
  const ddd_value_grams = { vancomycin: 2, meropenem: 3, ceftriaxone: 2, ciprofloxacin: 1, linezolid: 1.2 };
  const ddd_per_1000_patient_days = (total_grams * 1000) / ((patient_days || 1) * (ddd_value_grams[drug] || 1));
  return {
    drug, total_grams_used,
    ddd_per_1000_patient_days: Math.round(ddd_per_1000_patient_days * 100) / 100,
    benchmark_status: ddd_per_1000_patient_days > 50 ? 'above_target' : ddd_per_1000_patient_days > 25 ? 'within_range' : 'below_target',
    citation: CITATIONS.CDC_CORE,
  };
}

function opatPathway(input) {
  const { diagnosis, planned_antibiotic_duration_days, can_attend_outpatient_clinic, line_access, home_supervision_available } = input;
  return {
    opat_eligible: planned_antibiotic_duration_days >= 14 && can_attend_outpatient_clinic && line_access && home_supervision_available,
    antibiotic_options: diagnosis === 'osteomyelitis' ? 'IV_ceftriaxone_daily_OR_oral_linezolid' : diagnosis === 'endocarditis' ? 'IV_ceftriaxone_daily_with_oral_aminoglycoside' : diagnosis === 'cellulitis_with_bacteremia' ? 'IV_ceftriaxone_2g_daily' : 'tailor_to_diagnosis',
    monitoring_schedule: 'home_health_Q2M_x_2_weeks_then_Q1M_until_end_of_therapy',
    citation: CITATIONS.IDSA_ASP,
  };
}

module.exports = { deEscalationReview, ivToPoConversion, restrictedAntibioticApproval, cultureDirectedTherapy, dddTracking, opatPathway, CITATIONS, ValidationError };