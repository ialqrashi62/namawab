// filepath: tier5_rare_ext_104_tropical_engine.js
// TIER5_RARE_EXT-104: Rare/tropical infections (TB, leishmaniasis, brucellosis, ebola, viral_hemorrhagic)
'use strict';

const CITATIONS = [
  'WHO_TB_2023',
  'WHO_Leishmania_NeglectedDiseases_2020',
  'CDC_Anthrax_2019',
  'WHO_Viral_Hemorrhagic_Fever_2023',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function tb_screen(req) {
  ensureNumber(req.symptom_count_pulm, 'symptom_count_pulm');
  ensureNumber(req.cxr_score, 'cxr_score');
  ensureBool(req.sputum_afb_smear_pos, 'sputum_afb_smear_pos');
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureStr(req.travel_history, 'travel_history');
  ensureEnum(req.travel_history, 'travel_history', ['none','endemic_country','long_stay_high_load_setting']);

  let tier;
  if (req.sputum_afb_smear_pos) tier = 'definite_TB_isolate_begun_drug_susceptibility';
  else if (req.cxr_score >= 6 || (req.symptom_count_pulm >= 3 && req.hiv_positive)) tier = 'highly_suspect_pursue_gene_xpert_or_drug_susceptibility';
  else if (req.symptom_count_pulm >= 2 || req.travel_history !== 'none') tier = 'suspect_test_with_GeneXpert_and_IGRA';
  else tier = 'low_probability_other_diagnoses_or_followup_with_quantiFERON';

  return { tier, sputum_afb_smear_pos: req.sputum_afb_smear_pos, cxr_score: req.cxr_score, hiv_positive: req.hiv_positive, citation: CITATIONS[0] };
}

function leishmaniasis(req) {
  ensureStr(req.region, 'region');
  ensureEnum(req.region, 'region', ['old_world_eb','old_world_lc','new_world_lc','k_a','mucocutaneous']);
  ensureNumber(req.rk39_rdt_pos, 'rk39_rdt_pos'); // 0 negative, 1 positive
  ensureBool(req.lymphadenopathy, 'lymphadenopathy');
  ensureBool(req.splenomegaly, 'splenomegaly');
  ensureBool(req.pancytopenia, 'pancytopenia');

  let diagnosis;
  if (req.region === 'k_a' || req.splenomegaly || req.pancytopenia) diagnosis = 'visceral_form_pursue_confirm_with_bone_marrow';
  else if (req.region === 'mucocutaneous') diagnosis = 'mucocutaneous_form_assess_nasal_destroying_lesion_drug_liposomal_amphotericin';
  else if (req.rk39_rdt_pos) diagnosis = 'cutaneous_form_unspecified_liposomal_amphotericin_cryotherapy';
  else diagnosis = 'non_leishmaniasis_reconsider_differential';
  return { region: req.region, diagnosis, citations: CITATIONS[1] };
}

function brucellosis(req) {
  ensureNumber(req.blood_culture_positive, 'blood_culture_positive');
  ensureNumber(req.serum_titer_1toX, 'serum_titer_1toX');
  ensureNumber(req.bone_joint_involvement, 'bone_joint_involvement');
  ensureNumber(req.unexplained_fever_weeks, 'unexplained_fever_weeks');
  ensureStr(req.exposure_history, 'exposure_history');
  ensureEnum(req.exposure_history, 'exposure_history', ['livestock_veterinarian','raw_milk_dairy','laboratory_exposure','unknown','other']);

  if (req.serum_titer_1toX < 2) throw new ValidationError('serum titer must be 2..5120', 'serum_titer_1toX');

  let diagnosis;
  if (req.blood_culture_positive) diagnosis = 'definite_brucellosis_treat_with_doxy_rifampin_for_6_weeks_or_doxy_streptomycin';
  else if (req.serum_titer_1toX >= 160 && req.unexplained_fever_weeks >= 1) diagnosis = 'probable_brucellosis_treatemt_with_doxy_rifampin';
  else if (req.serum_titer_1toX >= 80) diagnosis = 'possible_brucellosis_serum_followup_or_empirical_treatment';
  else diagnosis = 'brucellosis_less_likely_consider_differential';

  return {
    diagnosis,
    exposure_history: req.exposure_history,
    bone_joint_involvement: req.bone_joint_involvement,
    citations: CITATIONS,
  };
}

function anthrax_exposure(req) {
  ensureBool(req.feeding_on_sick_animals, 'feeding_on_sick_animals');
  ensureStr(req.anthrax_form, 'anthrax_form');
  ensureEnum(req.anthrax_form, 'anthrax_form', ['cutaneous','inhalation','gastrointestinal','injection']);
  ensureBool(req.diagnosis_confirmed_lab, 'diagnosis_confirmed_lab');
  ensureNumber(req.days_since_first_symptom, 'days_since_first_symptom');

  let exposure_cat;
  if (req.feeding_on_sick_animals || req.diagnosis_confirmed_lab) exposure_cat = 'confirmed_exposure_veterinary_follow_up';
  else exposure_cat = 'no_known_exposure_unrelated_to_anthrax';

  let action;
  if (exposure_cat === 'confirmed_exposure_veterinary_follow_up' && req.anthrax_form === 'cutaneous') action = 'cip_prophylaxis_60_days_plus_anthrax_vaccine_if_available';
  else if (exposure_cat === 'confirmed_exposure_veterinary_follow_up' && req.anthrax_form === 'inhalation') action = 'invasive_care_poisoning_iv_antibiotics';
  else if (exposure_cat === 'confirmed_exposure_veterinary_follow_up' && req.anthrax_form === 'gastrointestinal') action = 'invasive_care_iv_antibiotics_plus_supportive';
  else action = 'do_not_initiate_anthrax_prophylaxis';

  return { exposure_cat, anthrax_form: req.anthrax_form, action, citation: CITATIONS[2] };
}

function viral_hemorrhagic_screen(req) {
  ensureBool(req.fever_significant, 'fever_significant');
  ensureBool(req.diarrhea_vomiting, 'diarrhea_vomiting');
  ensureBool(req.bleeding_significant, 'bleeding_significant');
  ensureNumber(req.platelet_count, 'platelet_count');
  ensureNumber(req.csf_or_genomic_signal, 'csf_or_genomic_signal'); // 0 no, 1 positive ebola PCR for example
  ensureStr(req.outbreak_zone, 'outbreak_zone');
  ensureEnum(req.outbreak_zone, 'outbreak_zone', ['none','known_outbreak_active','suspected_unknown']);

  let triage;
  if (req.csf_or_genomic_signal) triage = 'positive_vhf_admit_to_EID_ward_initiate_pcr_and_contact_precautions';
  else if (req.bleeding_significant && req.platelet_count < 50 && req.outbreak_zone !== 'none' && req.fever_significant) triage = 'high_suspicion_manage_as_vhf_until_pcr_negative';
  else if (req.outbreak_zone === 'known_outbreak_active' && req.fever_significant) triage = 'high_exposure_risk_isolate_until_pcr_clear';
  else if (req.outbreak_zone !== 'none' && (req.diarrhea_vomiting || req.fever_significant)) triage = 'isolate_and_test';
  else triage = 'low_pretest_probability_manage_differentially';

  return { triage, citation: CITATIONS[3] };
}

function funcs() {
  return { tb_screen, leishmaniasis, brucellosis, anthrax_exposure, viral_hemorrhagic_screen };
}

module.exports = { funcs, CITATIONS, ValidationError };
