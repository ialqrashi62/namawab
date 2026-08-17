// filepath: tier26_oncology_ext_164_chemo_engine.js
// TIER26_ONCOLOGY-164: Chemotherapy regimens, dose calculations, toxicity
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function bsa(req) {
  ensureNumber(req.weight_kg, 'weight');
  ensureNumber(req.height_cm, 'height');
  const bsa_calc = Math.sqrt((req.weight_kg * req.height_cm) / 3600);
  let status;
  if (bsa_calc < 1.0) status = 'low_bsa_cap_dose';
  else if (bsa_calc > 2.5) status = 'high_bsa_cap_dose';
  else status = 'bsa_calculated';
  return { status, bsa: Math.round(bsa_calc * 100) / 100 };
}

function regimen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.regimen, 'regimen', ['folfox','folfiri','capox','capiri','ac_t','tc','dd_ac','dd_tc','chop','r_chop','abvd','r_abvd','gemcitabine_cisplatin','pemetrexed_cisplatin','epirubicin_cyclophosphamide','dose_dense_ac','tpc','none','other']);
  ensureNumber(req.cycle_number, 'cycle');
  ensureNumber(req.dose_pct, 'dose_pct');
  ensureEnum(req.line, 'line', ['adjuvant','neoadjuvant','first_line','second_line','third_line','maintenance','palliative','other']);
  ensureBool(req.bone_marrow_recovered, 'marrow');
  let status;
  if (!req.bone_marrow_recovered) status = 'marrow_not_recovered_delay_cycle';
  else if (req.dose_pct < 75) status = 'dose_reduction_clarify';
  else status = 'regimen_appropriate';
  return { status, regimen: req.regimen };
}

function toxicity(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.ctcae_grade, 'ctcae_grade', ['1','2','3','4','5','unknown','other']);
  ensureEnum(req.toxicity_type, 'toxicity_type', ['neutropenia','anemia','thrombocytopenia','nausea_vomiting','diarrhea','mucositis','neuropathy','fatigue','hand_foot','cardiotoxicity','nephrotoxicity','ototoxicity','pulmonary','hypersensitivity','other']);
  ensureBool(req.hospitalization, 'hosp');
  ensureBool(req.dose_delay_required, 'delay');
  ensureNumber(req.days_since_last_cycle, 'days');
  let status;
  if (req.ctcae_grade === '4' || req.ctcae_grade === '5') status = 'grade_4_or_5_emergency_life_threatening';
  else if (req.ctcae_grade === '3') status = 'grade_3_severe_dose_modify';
  else if (req.hospitalization && req.toxicity_type === 'neutropenia') status = 'febrile_neutropenia_admit_abx';
  else status = 'toxicity_managed';
  return { status, grade: req.ctcae_grade };
}

function premed(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.regimen, 'regimen', ['folfox','folfiri','capox','capiri','ac_t','tc','dd_ac','dd_tc','chop','r_chop','abvd','r_abvd','gemcitabine_cisplatin','pemetrexed_cisplatin','epirubicin_cyclophosphamide','dose_dense_ac','tpc','none','other']);
  ensureBool(req.antiemetic_given, 'antiemetic');
  ensureBool(req.corticosteroid_given, 'steroid');
  ensureEnum(req.granulocyte_given, 'granulocyte', ['filgrastim','pegfilgrastim','biosimilar_filgrastim','none','other']);
  ensureBool(req.allergy_prophylaxis, 'allergy');
  let status;
  if (req.regimen === 'folfox' && !req.antiemetic_given) status = 'antiemetic_required_high_emetic';
  else if ((req.regimen === 'r_chop' || req.regimen === 'dd_ac') && req.granulocyte_given === 'none') status = 'high_febrile_neutropenia_risk_g_csf';
  else status = 'premed_appropriate';
  return { status, regimen: req.regimen };
}

function response(req) {
  ensureStr(req.assessment_id, 'assessment_id');
  ensureEnum(req.recist, 'recist', ['cr_complete_response','pr_partial_response','sd_stable_disease','pd_progressive_disease','ne_not_evaluable','unknown','other']);
  ensureNumber(req.cycle_count, 'cycle');
  ensureEnum(req.method, 'method', ['ct','mri','pet','clinical','tumor_markers','mixed','other']);
  ensureBool(req.tumor_burden_pct_change, 'burden_change');
  ensureBool(req.new_lesions, 'new');
  let status;
  if (req.recist === 'pd_progressive_disease') status = 'pd_change_line_or_clinical_trial';
  else if (req.recist === 'pr_partial_response' && req.cycle_count >= 4) status = 'pr_continue_response_assessed';
  else if (req.recist === 'cr_complete_response') status = 'cr_continue_or_maintenance';
  else status = 'response_assessed_continue';
  return { status, recist: req.recist };
}

const CITATIONS = { NCCN_CHEMO_2024: 'NCCN Chemotherapy 2024', CTCAE_5_2024: 'CTCAE v5 2024', RECIST_2024: 'RECIST 1.1 2024' };

function funcs() { return { bsa, regimen, toxicity, premed, response }; }
module.exports = { funcs, CITATIONS, ValidationError };