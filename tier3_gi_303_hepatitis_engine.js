/**
 * TIER3_GI-303 Viral Hepatitis Engine
 * HBV staging + HCV treatment algorithm + HDV coinfection + vaccination status
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AASLD_HBV: 'AASLD HBV 2018', AASLD_HCV: 'AASLD HCV 2023', EASL: 'EASL 2024' };

function hbvStaging(input) {
  const { hbeag, hbsag_quant, alt, hbv_dna, fibrosis_stage } = input;
  const immune_active = alt > 2 && hbv_dna > 2000;
  let phase = 'immune_tolerant';
  if (immune_active && hbeag) phase = 'HBeAg_positive_immune_active';
  else if (immune_active && !hbeag) phase = 'HBeAg_negative_immune_active';
  else if (hbsag_quant < 1000 && alt_normal) phase = 'inactive_carrier';
  const treatment = immune_active || fibrosis_stage === 'F4' || hbsag_quant > 10000;
  return { phase, treatment_indicated: treatment, first_line_drugs: ['entecavir', 'tenofovir_alafenamide', 'tenofovir_disoproxil'] };
}

function hcvTreatment(input) {
  const { genotype, fibrosis_stage, prior_treatment, decompensated, hcc_hx, renal_function } = input;
  const regimens = {
    G1: ['glecaprevir_pibrentasvir_8wk', 'sofosbuvir_velpatasvir_12wk'],
    G2: ['glecaprevir_pibrentasvir_8wk', 'sofosbuvir_velpatasvir_12wk'],
    G3: ['glecaprevir_pibrentasvir_12wk', 'sofosbuvir_velpatasvir_12wk'],
    G4: ['glecaprevir_pibrentasvir_8-12wk', 'sofosbuvir_velpatasvir_12wk'],
    G5: ['glecaprevir_pibrentasvir_8wk', 'sofosbuvir_velpatasvir_12wk'],
    G6: ['glecaprevir_pibrentasvir_8wk', 'sofosbuvir_velpatasvir_12wk'],
  };
  let duration_weeks = fibrosis_stage === 'advanced' ? 12 : 8;
  if (prior_treatment) duration_weeks = 12;
  return { genotype, regimen: regimens[`G${genotype}`]?.[0] || 'specialist_consult', duration_weeks, decompensated_adjustment: decompensated ? 'add_ribavirin_or_refer_liver_transplant' : 'none' };
}

function hdvScreening(input) {
  const { hbsag_positive, anti_hdv, hdv_rna } = input;
  return {
    hdv_screening_indicated: hbsag_positive,
    anti_hdv_positive: anti_hdv,
    active_hdv_infection: hdv_rna && hdv_rna > 100,
    treatment: anti_hdv ? ['Bulevirtide 2mg SC daily', 'Pegylated IFN-α for 48 weeks'] : ['not_indicated'],
    citation: CITATIONS.EASL,
  };
}

function hepatitisVaccinationCheck(input) {
  const { anti_hbs, anti_hav, hep_b_series_done, hep_a_series_done } = input;
  return {
    hbv_immune: anti_hbs >= 10,
    hav_immune: anti_hav === 'positive',
    hep_b_action: anti_hbs >= 10 ? 'immune' : hep_b_series_done ? 'booster_recommended' : 'vaccinate',
    hep_a_action: anti_hav === 'positive' ? 'immune' : hep_a_series_done ? 'check_titer' : 'vaccinate',
  };
}

function hepBScreeningProtocol(input) {
  const { pregnant, hiv_positive, prep_user, household_hbv, dialysis } = input;
  const screening = ['hbsag', 'anti_hbs', 'anti_hbc'];
  if (pregnant) screening.push('hbeag');
  if (hiv_positive) screening.push('hiv_rna_viral_load');
  return { screening_tests: screening, high_priority: pregnant || prep_user || dialysis, frequency: 'at_risk_groups_annual' };
}

module.exports = { hbvStaging, hcvTreatment, hdvScreening, hepatitisVaccinationCheck, hepBScreeningProtocol, CITATIONS, ValidationError };