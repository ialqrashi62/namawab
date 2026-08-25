'use strict';
// TIER4_ORTHO-101 Sports Medicine
const CITATIONS = [
  { id: 'AOSSM-2024', source: 'American Orthopedic Society Sports Medicine', year: 2024 },
  { id: 'ESSKA-2024', source: 'European Society Sports Traumatology Knee Surgery', year: 2024 }
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
function aclInjuryManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const activity_level = ensureEnum(input, 'activity_level', ['sedentary', 'recreational', 'competitive', 'professional']);
  const tear_pattern = ensureEnum(input, 'tear_pattern', ['partial', 'complete', 'proximal', 'midsubstance', 'distal']);
  const associated_meniscal = input.meniscal_tear === true;
  const laxity = ensureEnum(input, 'laxity', ['none', '1plus', '2plus', '3plus']);
  const surgery_indicated = (age < 55 && activity_level !== 'sedentary') || associated_meniscal;
  const graft = age < 35 ? 'btb_patellar_tendon_autograft' : 'ht_quad_tendon_autograft';
  const rehab = {
    prehab: 'pre_surgery_quad_strengthening_range_of_motion',
    post_op_0_2: 'weight_bearing_tolerated_knee_immobilizer_cryotherapy',
    post_op_2_6: 'closed_kinetic_chain_quad_hamstring_strength',
    post_op_6_12: 'jogging_light_running_progressive',
    post_op_6_9_months: 'return_to_sport_criteria_limb_symmetry_index_gt_90'
  };
  return {
    module: 'tier4_ortho_101_acl',
    patient_id: patientId,
    age,
    activity_level,
    tear_pattern,
    meniscal_tear: associated_meniscal,
    surgery_indicated,
    graft,
    rehab,
    citations: CITATIONS
  };
}
function rotatorCuffTear(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const tear_size = ensureEnum(input, 'tear_size', ['partial', 'small_full', 'medium_full', 'large_full', 'massive']);
  const retraction = ensureEnum(input, 'retraction', ['none', 'minimal', 'glenohumeral', 'medial_to_glenoid']);
  const fatty_infiltration = ensureNumber(input, 'goutallier_grade', 0, 4);
  const acromiohumeral = ensureNumber(input, 'acromiohumeral_distance_mm', 0, 20);
  const conservative = tear_size === 'partial' || age > 70;
  const surgery = !conservative && (retraction === 'none' || retraction === 'minimal') && fatty_infiltration <= 2;
  return {
    module: 'tier4_ortho_101_rotator_cuff',
    patient_id: patientId,
    age,
    tear_size,
    retraction,
    fatty_infiltration,
    acromiohumeral_distance_mm: acromiohumeral,
    conservative_care: conservative ? 'pt_steroid_injection_3_to_6_months' : 'failure_review',
    surgery_indicated: surgery,
    surgery_type: surgery ? 'arthroscopic_repair_with_acromioplasty' : 'not_indicated',
    citations: CITATIONS
  };
}
function meniscusTear(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const zone = ensureEnum(input, 'zone', ['red_red', 'red_white', 'white_white']);
  const tear_pattern = ensureEnum(input, 'tear_pattern', ['vertical', 'horizontal', 'radial', 'bucket_handle', 'complex', 'root']);
  const root_tear = tear_pattern === 'root';
  const repairable = zone === 'red_red' || (zone === 'red_white' && tear_pattern === 'vertical');
  const therapy = repairable ? 'arthroscopic_repair_zone_specific' : 'partial_meniscectomy_root_tear_consider_repair';
  return {
    module: 'tier4_ortho_101_meniscus',
    patient_id: patientId,
    zone,
    tear_pattern,
    repairable,
    therapy,
    root_tear,
    monitoring: 'axial_mri_6_mo_for_root_assess',
    citations: CITATIONS
  };
}
function concussionReturn(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptom_score = ensureNumber(input, 'scat5_score', 0, 100);
  const balance = ensureEnum(input, 'balance_error', ['normal', 'impaired']);
  const days_since_injury = ensureNumber(input, 'days_since_injury', 0, 90);
  const graduated = days_since_injury >= 7 && symptom_score >= 70 && balance === 'normal';
  return {
    module: 'tier4_ortho_101_concussion',
    patient_id: patientId,
    scat5: symptom_score,
    days_since_injury,
    graduated_protocol_eligible: graduated,
    graduated_protocol: '24h_step1_to_step5_24h_each_full_contact',
    clearance: 'neuropsych_testing_passed_required',
    citations: CITATIONS
  };
}
module.exports = {
  aclInjuryManagement,
  rotatorCuffTear,
  meniscusTear,
  concussionReturn,
  CITATIONS,
  ValidationError
};
