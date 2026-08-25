'use strict';
// TIER4_RARE-104 Mastocytosis & Mast Cell Disorders
// CM, SM, ISM, SSM, ASM, MCL
const CITATIONS = [
  { id: 'ECNM-2022', source: 'European Competence Network on Mastocytosis', year: 2022 },
  { id: 'NCCN-Mastocytosis', source: 'NCCN Guidelines - Systemic Mastocytosis', year: 2024 },
  { id: 'WHO-2022', source: 'WHO Classification - Mastocytosis', year: 2022 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function mastocytosisClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tryptase = ensureNumber(input, 'serum_tryptase_ng_ml', 0, 200);
  const kit_d816v = input.kit_d816v === true;
  const bone_marrow_involvement = input.bone_marrow_involvement === true;
  const c_findings = Array.isArray(input.c_findings) ? input.c_findings : [];
  const b_findings = Array.isArray(input.b_findings) ? input.b_findings : [];
  const skin_only = kit_d816v === false && bone_marrow_involvement === false;
  const systemic = bone_marrow_involvement && tryptase > 20;
  let diagnosis = 'cutaneous_mastocytosis';
  if (skin_only) diagnosis = 'cutaneous_mastocytosis';
  else if (systemic && c_findings.length === 0) {
    if (b_findings.length >= 2) diagnosis = 'systemic_mastocytosis_sm';
    else diagnosis = 'indolent_systemic_mastocytosis_ism';
  } else if (systemic && c_findings.length >= 1 && b_findings.length >= 2) diagnosis = 'aggressive_systemic_mastocytosis_asm';
  else if (systemic && c_findings.length >= 1 && (b_findings.length === 0 || b_findings.length === 1)) diagnosis = 'sm_with_c_findings_ssm';
  const flags = [];
  if (tryptase > 200) flags.push('TRYPTASE_URGENT_REVIEW_MAST_CELL_LEUKEMIA');
  if (c_findings.includes('bone_marrow_failure')) flags.push('AGGRESSIVE_VARIANT_FOLLOWUP_BMT_CENTER');
  return {
    module: 'tier4_rare_104_mastocytosis',
    patient_id: patientId,
    diagnosis,
    tryptase,
    kit_d816v_positive: kit_d816v,
    bone_marrow_involvement,
    b_findings,
    c_findings,
    flags,
    citations: CITATIONS
  };
}
function mastCellActivationManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptoms = Array.isArray(input.symptoms) ? input.symptoms : [];
  const triggers = Array.isArray(input.triggers) ? input.triggers : [];
  const tryptase_baseline = ensureNumber(input, 'tryptase_baseline', 0, 200);
  const epipen_present = input.epipen_present === true;
  const therapy = {
    h1_antihistamine: 'cetirizine_10mg_bid_or_doubled',
    h2_antihistamine: 'famotidine_20mg_bid',
    mast_cell_stabilizer: 'cromolyn_100mg_qid',
    leukotriene: 'montelukast_10mg_daily',
    epinephrine_autoinjector: epipen_present || symptoms.includes('anaphylaxis') ? 'carry_2_doses' : 'prescribe_high_risk'
  };
  const trigger_avoidance = {
    foods: triggers.filter(t => ['spicy', 'alcohol', 'aged_cheese', 'fermented', 'shellfish'].includes(t)),
    medications: triggers.filter(t => ['nsaid', 'opioid', 'vancomycin', 'fluorescein'].includes(t)),
    physical: triggers.filter(t => ['heat', 'cold', 'pressure', 'friction', 'exercise'].includes(t)),
    emotional: triggers.includes('stress') ? 'stress_management_referral' : null
  };
  return {
    module: 'tier4_rare_104_mcas',
    patient_id: patientId,
    symptoms,
    triggers,
    therapy,
    trigger_avoidance,
    citations: CITATIONS
  };
}
function avapritinibKitD816V(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const variant = ensureEnum(input, 'kit_variant', ['d816v', 'd816y', 'd820g', 'v560g']);
  const diagnosis = ensureEnum(input, 'diagnosis', ['ism', 'asm', 'sm_ahn', 'mcl']);
  const platelet_count = ensureNumber(input, 'platelet_count', 0, 1000);
  const eligible = variant === 'd816v' && (diagnosis === 'asm' || diagnosis === 'sm_ahn' || diagnosis === 'mcl');
  return {
    module: 'tier4_rare_104_avapritinib',
    patient_id: patientId,
    kit_variant: variant,
    diagnosis,
    eligible_for_avapritinib: eligible,
    dosing_if_eligible: '200mg_po_daily_asm_sm_ahn',
    monitoring: {
      platelet_watch: platelet_count < 50,
      edema_monitor: true,
      cns_effects: 'cognitive_impairment_assessment_baseline_and_q3mo',
      lft_q2wk_x2_then_monthly: true
    },
    citations: CITATIONS
  };
}
function midostaurinIndication(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const d816v = input.d816v === true;
  const advanced_disease = ensureEnum(input, 'advanced_disease', ['asm', 'mcl', 'sm_ahn']);
  return {
    module: 'tier4_rare_104_midostaurin',
    patient_id: patientId,
    d816v,
    advanced_disease,
    eligible: d816v && advanced_disease !== 'ism',
    dosing: '100mg_po_bid_with_meals',
    monitoring: { lft_q2wk: true, cbc_q2wk: true, gi_toxicity: 'nausea_vomiting_prophylaxis' },
    citations: CITATIONS
  };
}
function mastocytosisAnesthesiaPlan(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const diagnosis = ensureEnum(input, 'diagnosis', ['cm', 'ism', 'asm', 'mcl']);
  const h1_h2_premed = input.h1_h2_premed === true;
  const tryptase_preop = ensureNumber(input, 'tryptase_preop', 0, 200);
  const anesthetic_agents = {
    safe: ['propofol', 'midazolam', 'fentanyl', 'rocuronium', 'sevoflurane', 'lidocaine'],
    avoid: ['morphine', 'meperidine', 'atracurium', 'mivacurium', 'succinylcholine', 'vancomycin', 'fluorescein']
  };
  return {
    module: 'tier4_rare_104_anesthesia',
    patient_id: patientId,
    diagnosis,
    h1_h2_premed,
    tryptase_preop,
    intraop_monitoring: 'tryptase_if_signs_baseline_q30min',
    safe_agents: anesthetic_agents.safe,
    avoid_agents: anesthetic_agents.avoid,
    postop_observation: 'extended_4h_for_symptom_watch',
    citations: CITATIONS
  };
}
module.exports = {
  mastocytosisClassification,
  mastCellActivationManagement,
  avapritinibKitD816V,
  midostaurinIndication,
  mastocytosisAnesthesiaPlan,
  CITATIONS,
  ValidationError
};
