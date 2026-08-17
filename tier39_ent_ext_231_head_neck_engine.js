// filepath: tier39_ent_ext_231_head_neck_engine.js
// TIER39_ENT-231: Head & neck
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function thyroid_nodule_ent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.nodule_size_cm, 'size');
  ensureEnum(req.tirads, 'tirads', ['tr1','tr2','tr3','tr4','tr5','other']);
  ensureNumber(req.tsh, 'tsh');
  ensureBool(req.biopsy_indicated, 'bx');
  ensureEnum(req.cytology, 'cyto', ['bethesda_i','bethesda_ii','bethesda_iii','bethesda_iv','bethesda_v','bethesda_vi','pending','not_done','other']);
  let status;
  if (req.cytology === 'bethesda_v' || req.cytology === 'bethesda_vi') status = 'malignant_cytology_thyroidectomy_refer';
  else if (req.cytology === 'bethesda_iii' || req.cytology === 'bethesda_iv') status = 'indeterminate_cytology_molecular_test_repeat';
  else if (req.tirads === 'tr5' && req.biopsy_indicated === false) status = 'tr5_biopsy_indicated';
  else if (req.tirads === 'tr3' && req.nodule_size_cm >= 2.5) status = 'tr3_large_size_follow_repeat';
  else status = 'thyroid_nodule_review';
  return { status, c: req.cytology };
}

function salivary_gland_tumor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['parotid','submandibular','sublingual','minor_palatal','minor_buccal','minor_lingual','multiple','other']);
  ensureNumber(req.size_cm, 'size');
  ensureBool(req.mri_done, 'mri');
  ensureBool(req.benign_features, 'benign');
  ensureEnum(req.fnac, 'fnac', ['pleomorphic_adenoma','warthin_tumor','mucoepidermoid','adenoid_cystic','acinic_cell','malignant','non_diagnostic','atypical','pending','not_done','other']);
  ensureBool(req.surgery_planned, 'sx');
  let status;
  if (req.fnac === 'malignant' && req.surgery_planned) status = 'malignant_salivary_wide_resection_refer';
  else if (req.fnac === 'mucoepidermoid' && req.location === 'parotid' && req.surgery_planned) status = 'mucoepidermoid_parotidectomy_with_margin';
  else if (req.size_cm >= 3 && req.location === 'submandibular') status = 'large_submandibular_mass_refer';
  else if (req.fnac === 'pleomorphic_adenoma' && req.surgery_planned) status = 'pleomorphic_adenoma_parotidectomy_complete';
  else status = 'salivary_tumor_review';
  return { status, f: req.fnac };
}

function neck_mass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['level_1','level_2','level_3','level_4','level_5','level_6','submandibular','post_auricular','occipital','multiple','other']);
  ensureNumber(req.size_cm, 'size');
  ensureEnum(req.imaging, 'img', ['ct','mri','ultrasound','pet','none','other']);
  ensureBool(req.constitutional_symptoms, 'cs');
  ensureBool(req.fna_indicated, 'fna');
  ensureEnum(req.differential, 'diff', ['reactive_lymph_node','congenital_cyst','infection','metastasis','lymphoma','thyroid_lesion','vascular','lipoma','unknown','other']);
  let status;
  if (req.size_cm >= 2 && req.fna_indicated === false) status = 'large_mass_fna_required';
  else if (req.constitutional_symptoms && req.differential === 'lymphoma') status = 'lymphoma_features_excisional_biopsy';
  else if (req.size_cm >= 3 && req.constitutional_symptoms) status = 'large_mass_constitutional_urgent_workup';
  else if (req.fna_indicated) status = 'neck_mass_fna_planned';
  else status = 'neck_mass_review';
  return { status, sz: req.size_cm };
}

function parotid_tumor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['superficial_lobe','deep_lobe','both','tail','accessory','other']);
  ensureNumber(req.size_cm, 'size');
  ensureEnum(req.fnac, 'fnac', ['pleomorphic_adenoma','warthin_tumor','mucoepidermoid','adenoid_cystic','acinic_cell','malignant','lymphoma','non_diagnostic','pending','not_done','other']);
  ensureEnum(req.facial_nerve_baseline, 'fn', ['normal','mild_weakness','moderate_weakness','severe_weakness','paralysis','unknown','other']);
  ensureEnum(req.surgery_planned, 'sx', ['superficial_parotidectomy','total_parotidectomy','extracapsular_dissection','radical_parotidectomy','none','observation','other']);
  let status;
  if (req.facial_nerve_baseline === 'paralysis') status = 'pre_op_facial_palsy_malignancy_review';
  else if (req.fnac === 'warthin_tumor' && req.surgery_planned === 'superficial_parotidectomy') status = 'warthin_tumor_surgical_curative';
  else if (req.location === 'deep_lobe' && req.fnac === 'malignant') status = 'deep_lobe_malignant_total_parotidectomy';
  else if (req.fnac === 'pleomorphic_adenoma' && req.surgery_planned === 'superficial_parotidectomy') status = 'parotid_pleomorphic_parotidectomy_complete';
  else status = 'parotid_review';
  return { status, fn: req.facial_nerve_baseline };
}

function lymphadenopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.region, 'region', ['cervical','axillary','inguinal','epitrochlear','supraclavicular','preauricular','occipital','multiple','other']);
  ensureNumber(req.nodes_palpable, 'nodes');
  ensureNumber(req.size_cm_node, 'sz');
  ensureBool(req.tender, 'tender');
  ensureBool(req.infectious_signs, 'inf');
  ensureEnum(req.imaging, 'img', ['ultrasound','ct','mri','pet','none','other']);
  ensureBool(req.follow_up_4_weeks, 'fup');
  let status;
  if (req.size_cm_node >= 2 && req.tender === false && req.infectious_signs === false) status = 'painless_large_node_fna_imaging_review';
  else if (req.tender && req.infectious_signs) status = 'reactive_node_observation_antibiotic';
  else if (!req.follow_up_4_weeks && req.tender === false) status = 'painless_node_follow_up_required';
  else if (req.size_cm_node < 1 && req.tender === false) status = 'small_painless_node_observation';
  else status = 'lymphadenopathy_review';
  return { status, sz: req.size_cm_node };
}

function funcs() { return { thyroid_nodule_ent, salivary_gland_tumor, neck_mass, parotid_tumor, lymphadenopathy }; }
module.exports = { funcs, ValidationError };